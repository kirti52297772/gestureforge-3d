import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// -------------------- APPLICATION UI --------------------

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header class="topbar">
      <div class="brand">GESTURE<span>FORGE</span> 3D</div>
      <div class="status">● SYSTEM ONLINE</div>
    </header>

    <div class="layout">
      <section class="panel">
        <div class="panel-heading">
          <div class="eyebrow">INTERACTIVE ENGINEERING LAB</div>
          <h1>Machine Explorer</h1>
          <div class="subtitle">
            Explore a 3D mechanical assembly. Drag to rotate, scroll to zoom,
            and use the controls to inspect its components.
          </div>
        </div>

        <div class="viewer" id="viewer">
          <div class="viewer-label">3D VIEWPORT / LIVE RENDER</div>
          <div id="handCursor" class="hand-cursor"></div>

          <div class="gesture-panel">
            <div class="gesture-panel-heading">LIVE GESTURE RECOGNITION</div>
            <div class="gesture-status">
              <span class="status-dot"></span>
              <span id="trackingStatus">INITIALIZING...</span>
            </div>
            <div class="gesture-result">
              <div class="gesture-label">DETECTED GESTURE</div>
              <div id="gestureName">NO HAND DETECTED</div>
            </div>
            <div class="gesture-hint" id="gestureHint">
              Show your hand to the camera
            </div>
          </div>
        </div>

        <div class="controls">
          <button class="action primary" id="rotate">Ⅱ Pause Rotation</button>
          <button class="action" id="explode">Exploded View</button>
          <button class="action" id="reset">Reset View</button>
        </div>
      </section>

      <aside class="side">
        <section class="panel">
          <h2>Assembly Status</h2>
          <div class="metric">
            <div class="metric-label">3D ENGINE</div>
            <div class="metric-value" id="engineStatus">INITIALIZING</div>
          </div>
          <div class="metric">
            <div class="metric-label">FRAME RATE</div>
            <div class="metric-value" id="fpsValue">-- FPS</div>
          </div>
          <div class="metric">
            <div class="metric-label">RENDER PERFORMANCE</div>
            <div class="metric-value" id="renderStatus">STARTING</div>
          </div>
          <div class="metric">
            <div class="metric-label">SELECTED COMPONENT</div>
            <div class="metric-value" id="selectedPart">Gear Assembly</div>
          </div>
          <div class="metric">
            <div class="metric-label">CONTROL MODE</div>
            <div class="metric-value" id="controlMode">MOUSE + KEYBOARD</div>
          </div>
          <div class="metric">
            <div class="metric-label">HAND TRACKING</div>
            <div class="metric-value" id="handStatus">CAMERA OFF</div>
          </div>
        </section>

        <section class="panel">
          <h2>Component Inspector</h2>
          <div class="metric">
            <div class="metric-label">COMPONENT NAME</div>
            <div class="metric-value" id="inspectName">No component selected</div>
          </div>
          <div class="metric">
            <div class="metric-label">COMPONENT TYPE</div>
            <div class="metric-value" id="inspectType">—</div>
          </div>
          <div class="metric">
            <div class="metric-label">PURPOSE</div>
            <div class="metric-value" id="inspectDescription">
              Select a component to see its purpose.
            </div>
          </div>
          <div class="metric">
            <div class="metric-label">POSITION (X, Y, Z)</div>
            <div class="metric-value" id="inspectPosition">—</div>
          </div>
          <div class="metric">
            <div class="metric-label">DIMENSIONS (X × Y × Z)</div>
            <div class="metric-value" id="inspectDimensions">—</div>
          </div>
          <div class="controls">
            <button class="action primary" id="focusComponent">Focus Component</button>
            <button class="action" id="clearSelection">Clear Selection</button>
          </div>
        </section>

        <section class="panel">
          <h2>Gesture Controls</h2>
          <p class="hint">
            MOVE HAND — Rotate assembly<br/>
            OPEN PALM — Pause / resume rotation<br/>
            PINCH — Select component
          </p>
          <button class="action primary" id="cameraButton">Enable Hand Tracking</button>
          <div class="camera-preview">
            <video id="webcam" autoplay playsinline muted></video>
            <canvas id="handCanvas"></canvas>
          </div>
        </section>

        <section class="panel">
          <h2>Keyboard Shortcuts</h2>
          <p class="hint">
            A / SPACE — Toggle rotation<br/>
            W / S — Rotate up / down<br/>
            Q / D — Rotate left / right<br/>
            + / − — Zoom in / out<br/>
            E — Exploded view<br/>
            R — Reset view<br/>
            ESC — Clear selection
          </p>
        </section>
      </aside>
    </div>
  </div>
`;

// -------------------- THREE.JS SCENE --------------------

const viewer = document.querySelector('#viewer');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0d1420');

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(5, 4, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#0d1420');
viewer.appendChild(renderer.domElement);

// -------------------- CAMERA CONTROLS --------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.minDistance = 3;
controls.maxDistance = 18;
controls.target.set(0, 0, 0);
controls.update();

const defaultCameraPosition = new THREE.Vector3(5, 4, 8);
const defaultCameraTarget = new THREE.Vector3(0, 0, 0);
let targetCameraPosition = camera.position.clone();
let targetCameraTarget = controls.target.clone();
let cameraTransition = false;

controls.addEventListener('start', () => {
  cameraTransition = false;
});

// -------------------- LIGHTS AND MATERIALS --------------------

scene.add(new THREE.AmbientLight('#ffffff', 2));

const light = new THREE.DirectionalLight('#8cecff', 3);
light.position.set(4, 7, 5);
scene.add(light);

const assembly = new THREE.Group();
scene.add(assembly);

const material = new THREE.MeshStandardMaterial({
  color: '#32c5d9',
  metalness: 0.65,
  roughness: 0.3
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: '#526780',
  metalness: 0.8,
  roughness: 0.28
});

const parts = [];

function addPart(name, geometry, position, mat = material) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.userData.partName = name;
  assembly.add(mesh);
  parts.push({ mesh, originalPosition: mesh.position.clone() });
  return mesh;
}

// -------------------- MECHANICAL ASSEMBLY --------------------

addPart(
  'Central Shaft',
  new THREE.CylinderGeometry(0.22, 0.22, 3.3, 32),
  [0, 0, 0],
  darkMaterial
);

function addGear(name, y, radius, teeth) {
  const gear = addPart(
    name,
    new THREE.CylinderGeometry(radius, radius, 0.28, teeth * 2),
    [0, y, 0]
  );
  gear.userData.selectableName = name;

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = addPart(
      `${name} Tooth ${i + 1}`,
      new THREE.BoxGeometry(0.16, 0.34, 0.25),
      [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
      darkMaterial
    );
    tooth.rotation.y = -angle;
    tooth.userData.selectableName = name;
  }
}

addGear('Upper Gear', 1.05, 1.0, 12);
addGear('Middle Gear', 0, 0.75, 10);
addGear('Lower Gear', -1.05, 0.55, 8);

addPart(
  'Base Plate',
  new THREE.BoxGeometry(3.3, 0.18, 2.5),
  [0, -1.95, 0],
  darkMaterial
);

addPart(
  'Central Hub',
  new THREE.CylinderGeometry(0.38, 0.38, 0.35, 32),
  [0, 0, 0],
  darkMaterial
);

// -------------------- COMPONENT VISIBILITY --------------------

const visibilityPanel = document.createElement('section');
visibilityPanel.className = 'panel';
visibilityPanel.innerHTML = `
  <h2>Component Visibility</h2>
  <p class="hint">Show or hide individual assembly components.</p>
  <div id="visibilityList"></div>
  <button class="action primary" id="showAllParts">Show All Components</button>
`;
document.querySelector('.side').appendChild(visibilityPanel);

const visibilityList = visibilityPanel.querySelector('#visibilityList');
const visibilityGroups = new Map();

parts.forEach(({ mesh }) => {
  const name = mesh.userData.selectableName ||
    mesh.userData.partName || 'Machine Component';

  if (!visibilityGroups.has(name)) visibilityGroups.set(name, []);
  visibilityGroups.get(name).push(mesh);
});

visibilityGroups.forEach((meshes, name) => {
  const label = document.createElement('label');
  label.style.display = 'flex';
  label.style.alignItems = 'center';
  label.style.gap = '10px';
  label.style.padding = '8px 0';
  label.style.cursor = 'pointer';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;

  const nameText = document.createElement('span');
  nameText.textContent = name;

  checkbox.addEventListener('change', () => {
    meshes.forEach(mesh => { mesh.visible = checkbox.checked; });
  });

  label.appendChild(checkbox);
  label.appendChild(nameText);
  visibilityList.appendChild(label);
});

document.querySelector('#showAllParts').addEventListener('click', () => {
  visibilityList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
  });
});

// -------------------- COMPONENT INSPECTOR --------------------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectedComponent = null;
let selectedMeshes = [];

const inspectName = document.querySelector('#inspectName');
const inspectType = document.querySelector('#inspectType');
const inspectDescription = document.querySelector('#inspectDescription');
const inspectPosition = document.querySelector('#inspectPosition');
const inspectDimensions = document.querySelector('#inspectDimensions');
const selectedPartLabel = document.querySelector('#selectedPart');

const componentDescriptions = {
  'Upper Gear': 'A toothed wheel used to demonstrate rotational motion and component selection.',
  'Middle Gear': 'A central gear in this demonstration model. Its teeth are grouped for selection.',
  'Lower Gear': 'A lower toothed wheel used to demonstrate grouped selection and 3D inspection.',
  'Central Shaft': 'A cylindrical shaft representing a component that can support or transmit rotation.',
  'Central Hub': 'A central cylindrical feature representing a connection or support point.',
  'Base Plate': 'The flat base representing a mounting surface for the assembly.'
};

function getComponentName(mesh) {
  return mesh.userData.selectableName ||
    mesh.userData.partName || 'Machine Component';
}

function clearComponentSelection() {
  selectedMeshes.forEach(({ mesh, originalMaterial }) => {
    mesh.material = originalMaterial;
  });

  selectedMeshes = [];
  selectedComponent = null;

  selectedPartLabel.textContent = 'Gear Assembly';
  inspectName.textContent = 'No component selected';
  inspectType.textContent = '—';
  inspectDescription.textContent = 'Select a component to see its purpose.';
  inspectPosition.textContent = '—';
  inspectDimensions.textContent = '—';
}

function selectComponent(mesh) {
  if (!mesh || !mesh.isMesh) return;

  selectedMeshes.forEach(({ mesh: oldMesh, originalMaterial }) => {
    oldMesh.material = originalMaterial;
  });
  selectedMeshes = [];
  selectedComponent = mesh;

  const selectedName = getComponentName(mesh);
  const matchingParts = assembly.children.filter(
    part => getComponentName(part) === selectedName
  );

  selectedMeshes = matchingParts.map(part => {
    const originalMaterial = part.material;
    const highlightMaterial = originalMaterial.clone();

    if (highlightMaterial.emissive) {
      highlightMaterial.emissive.set('#00d9ff');
      highlightMaterial.emissiveIntensity = 0.65;
    }

    part.material = highlightMaterial;
    return { mesh: part, originalMaterial };
  });

  selectedPartLabel.textContent = selectedName;
  inspectName.textContent = selectedName;
  inspectType.textContent = mesh.geometry.type.replace('Geometry', '');
  inspectDescription.textContent = componentDescriptions[selectedName] ||
    'A component of the interactive 3D demonstration assembly.';

  const worldPosition = new THREE.Vector3();
  mesh.getWorldPosition(worldPosition);
  inspectPosition.textContent = [
    worldPosition.x, worldPosition.y, worldPosition.z
  ].map(value => value.toFixed(2)).join(', ');

  mesh.geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  mesh.geometry.boundingBox.getSize(size);
  inspectDimensions.textContent = [
    size.x, size.y, size.z
  ].map(value => value.toFixed(2)).join(' × ');
}

function focusSelectedComponent() {
  if (!selectedComponent) {
    alert('Select a component first by clicking it or pinching with your hand.');
    return;
  }

  const box = new THREE.Box3().setFromObject(selectedComponent);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const distance = Math.max(size.x, size.y, size.z, 0.5) * 3.2;
  const direction = new THREE.Vector3(1, 0.7, 1).normalize();

  targetCameraPosition.copy(
    center.clone().add(direction.multiplyScalar(distance))
  );
  targetCameraTarget.copy(center);
  cameraTransition = true;
}
// -------------------- MODEL AND BUTTON STATE --------------------

let isExploded = false;
let isRotating = true;

document.querySelector('#engineStatus').textContent = 'ONLINE';

document.querySelector('#rotate').addEventListener('click', () => {
  isRotating = !isRotating;
  document.querySelector('#rotate').textContent =
    isRotating ? 'Ⅱ Pause Rotation' : '⟳ Resume Rotation';
});

document.querySelector('#explode').addEventListener('click', () => {
  isExploded = !isExploded;

  parts.forEach(({ mesh, originalPosition }) => {
    if (isExploded) {
      const direction = originalPosition.clone();

      if (direction.length() < 0.2) {
        direction.set(0, 1, 0);
      }

      direction.normalize();
      mesh.position.copy(originalPosition)
        .add(direction.multiplyScalar(0.8));
    } else {
      mesh.position.copy(originalPosition);
    }
  });

  document.querySelector('#explode').textContent =
    isExploded ? 'Reassemble Parts' : 'Exploded View';
});

document.querySelector('#reset').addEventListener('click', () => {
  assembly.rotation.set(0, 0, 0);
  isExploded = false;

  parts.forEach(({ mesh, originalPosition }) => {
    mesh.position.copy(originalPosition);
  });

  document.querySelector('#explode').textContent = 'Exploded View';

  targetCameraPosition.copy(defaultCameraPosition);
  targetCameraTarget.copy(defaultCameraTarget);
  cameraTransition = true;

  clearComponentSelection();
});

// -------------------- MOUSE / TOUCHPAD SELECTION --------------------

renderer.domElement.addEventListener('click', event => {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(assembly.children, false);

  if (hits.length > 0) {
    selectComponent(hits[0].object);
  }
});

document.querySelector('#focusComponent')
  .addEventListener('click', focusSelectedComponent);

document.querySelector('#clearSelection')
  .addEventListener('click', clearComponentSelection);

// -------------------- RESPONSIVE VIEW --------------------

function resize() {
  const width = Math.max(viewer.clientWidth, 1);
  const height = Math.max(viewer.clientHeight, 1);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);
resize();

// -------------------- PERFORMANCE MONITOR --------------------

const fpsValue = document.querySelector('#fpsValue');
const renderStatus = document.querySelector('#renderStatus');

let frameCount = 0;
let lastFpsUpdate = performance.now();

function updatePerformanceMonitor() {
  frameCount++;

  const now = performance.now();
  const elapsed = now - lastFpsUpdate;

  if (elapsed >= 1000) {
    const fps = Math.round((frameCount * 1000) / elapsed);

    fpsValue.textContent = `${fps} FPS`;
    renderStatus.textContent =
      fps >= 50 ? 'SMOOTH' :
      fps >= 30 ? 'NORMAL' :
      'LOW FPS';

    frameCount = 0;
    lastFpsUpdate = now;
  }
}

// -------------------- ANIMATION LOOP --------------------

function animate() {
  requestAnimationFrame(animate);

  if (isRotating) {
    assembly.rotation.y += 0.004;
  }

  if (cameraTransition) {
    camera.position.lerp(targetCameraPosition, 0.12);
    controls.target.lerp(targetCameraTarget, 0.12);

    const positionClose =
      camera.position.distanceTo(targetCameraPosition) < 0.01;

    const targetClose =
      controls.target.distanceTo(targetCameraTarget) < 0.01;

    if (positionClose && targetClose) {
      camera.position.copy(targetCameraPosition);
      controls.target.copy(targetCameraTarget);
      cameraTransition = false;
    }
  }

  controls.update();
  renderer.render(scene, camera);
  updatePerformanceMonitor();
}

animate();

// -------------------- KEYBOARD SHORTCUTS --------------------

window.addEventListener('keydown', event => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return;
  }

  const key = event.key.toLowerCase();

  if (event.code === 'Space') {
    event.preventDefault();
  }

  switch (key) {
    case 'a':
      document.querySelector('#rotate').click();
      break;

    case 'w':
      assembly.rotation.x -= 0.12;
      break;

    case 's':
      assembly.rotation.x += 0.12;
      break;

    case 'd':
      assembly.rotation.y += 0.12;
      break;

    case 'q':
      assembly.rotation.y -= 0.12;
      break;

    case '+':
    case '=':
      camera.position.addScaledVector(
        camera.position.clone().sub(controls.target).normalize(),
        -0.5
      );
      camera.position.clampLength(3, 18);
      controls.update();
      break;

    case '-':
    case '_':
      camera.position.addScaledVector(
        camera.position.clone().sub(controls.target).normalize(),
        0.5
      );
      camera.position.clampLength(3, 18);
      controls.update();
      break;

    case 'r':
      document.querySelector('#reset').click();
      break;

    case 'e':
      document.querySelector('#explode').click();
      break;

    case 'escape':
      clearComponentSelection();
      break;
  }

  if (event.code === 'Space') {
    document.querySelector('#rotate').click();
  }
});

// -------------------- HAND TRACKING SETUP --------------------

const cameraButton = document.querySelector('#cameraButton');
const webcam = document.querySelector('#webcam');
const handCanvas = document.querySelector('#handCanvas');
const handCtx = handCanvas.getContext('2d');

const handStatus = document.querySelector('#handStatus');
const controlMode = document.querySelector('#controlMode');
const trackingStatus = document.querySelector('#trackingStatus');
const gestureName = document.querySelector('#gestureName');
const gestureHint = document.querySelector('#gestureHint');
const handCursor = document.querySelector('#handCursor');

let handLandmarker = null;
let webcamRunning = false;
let lastVideoTime = -1;
let previousHandX = null;
let previousHandY = null;
let wasOpenPalm = false;
let wasPinching = false;
let lastPinchSelectionTime = 0;

const PINCH_COOLDOWN = 500;

// -------------------- START CAMERA --------------------

async function startHandTracking() {
  cameraButton.disabled = true;
  cameraButton.textContent = 'Loading hand tracking...';

  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 1
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    webcam.srcObject = stream;
    await webcam.play();

    handCanvas.width = 640;
    handCanvas.height = 480;

    webcamRunning = true;
    cameraButton.textContent = 'Stop Hand Tracking';
    cameraButton.disabled = false;

    handStatus.textContent = 'CAMERA ACTIVE';
    controlMode.textContent = 'HAND TRACKING';
    trackingStatus.textContent = 'SHOW YOUR HAND';
    trackingStatus.previousElementSibling.style.background = '#718096';

    detectHand();
  } catch (error) {
    console.error('Hand tracking error:', error);

    webcamRunning = false;
    handStatus.textContent = 'CAMERA ERROR';
    trackingStatus.textContent = 'CAMERA ERROR';
    cameraButton.textContent = 'Try Again';
    cameraButton.disabled = false;

    if (webcam.srcObject) {
      webcam.srcObject.getTracks().forEach(track => track.stop());
      webcam.srcObject = null;
    }

    if (handLandmarker) {
      handLandmarker.close();
      handLandmarker = null;
    }

    alert(
      'Could not start hand tracking. Check camera permission and internet connection, then check the browser console.'
    );
  }
}

// -------------------- GESTURE RECOGNITION HELPERS --------------------

function isFingerExtended(landmarks, tipIndex, jointIndex) {
  const wrist = landmarks[0];
  const tip = landmarks[tipIndex];
  const joint = landmarks[jointIndex];

  const tipDistance = Math.hypot(
    tip.x - wrist.x,
    tip.y - wrist.y
  );

  const jointDistance = Math.hypot(
    joint.x - wrist.x,
    joint.y - wrist.y
  );

  return tipDistance > jointDistance * 1.15;
}

function recognizeGesture(landmarks) {
  const indexUp = isFingerExtended(landmarks, 8, 5);
  const middleUp = isFingerExtended(landmarks, 12, 9);
  const ringUp = isFingerExtended(landmarks, 16, 13);
  const pinkyUp = isFingerExtended(landmarks, 20, 17);

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];

  const pinchDistance = Math.hypot(
    thumbTip.x - indexTip.x,
    thumbTip.y - indexTip.y
  );

  if (pinchDistance < 0.05) {
    return {
      name: 'PINCH',
      hint: 'Thumb and index finger are close',
      isPinching: true,
      isOpenPalm: false
    };
  }

  if (indexUp && middleUp && ringUp && pinkyUp) {
    return {
      name: 'OPEN PALM',
      hint: 'Open palm detected',
      isPinching: false,
      isOpenPalm: true
    };
  }

  if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
    return {
      name: 'FIST',
      hint: 'Your fingers appear curled',
      isPinching: false,
      isOpenPalm: false
    };
  }

  if (indexUp && !middleUp && !ringUp && !pinkyUp) {
    return {
      name: 'POINTING',
      hint: 'Index finger appears extended',
      isPinching: false,
      isOpenPalm: false
    };
  }

  return {
    name: 'UNKNOWN',
    hint: 'Try an open palm, fist, pointing, or pinch',
    isPinching: false,
    isOpenPalm: false
  };
}
// -------------------- HAND DETECTION LOOP --------------------

function detectHand() {
  if (!webcamRunning || !handLandmarker) return;

  if (webcam.readyState >= 2 && webcam.currentTime !== lastVideoTime) {
    lastVideoTime = webcam.currentTime;

    const result = handLandmarker.detectForVideo(
      webcam,
      performance.now()
    );

    handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);

    if (result.landmarks && result.landmarks.length > 0) {
      const landmarks = result.landmarks[0];
      const gesture = recognizeGesture(landmarks);

      trackingStatus.textContent = 'HAND TRACKING ACTIVE';
      trackingStatus.previousElementSibling.style.background = '#39e58c';
      gestureName.textContent = gesture.name;
      gestureHint.textContent = gesture.hint;

      // Draw the hand skeleton.
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12],
        [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20],
        [0, 17]
      ];

      handCtx.strokeStyle = '#39d6e7';
      handCtx.lineWidth = 3;

      for (const [start, end] of connections) {
        handCtx.beginPath();
        handCtx.moveTo(
          (1 - landmarks[start].x) * handCanvas.width,
          landmarks[start].y * handCanvas.height
        );
        handCtx.lineTo(
          (1 - landmarks[end].x) * handCanvas.width,
          landmarks[end].y * handCanvas.height
        );
        handCtx.stroke();
      }

      handCtx.fillStyle = '#ffffff';

      for (const point of landmarks) {
        handCtx.beginPath();
        handCtx.arc(
          (1 - point.x) * handCanvas.width,
          point.y * handCanvas.height,
          5,
          0,
          Math.PI * 2
        );
        handCtx.fill();
      }

      // Stabilized hand-controlled rotation.
      const palm = landmarks[9];

      if (previousHandX !== null && !gesture.isOpenPalm) {
        const dx = palm.x - previousHandX;
        const dy = palm.y - previousHandY;
        const deadZone = 0.003;

        if (Math.abs(dx) > deadZone) {
          assembly.rotation.y -= dx * 3;
        }

        if (Math.abs(dy) > deadZone) {
          assembly.rotation.x += dy * 3;
        }
      }

      previousHandX = palm.x;
      previousHandY = palm.y;

      handStatus.textContent = 'HAND DETECTED';

      // Move the on-screen cursor to the index fingertip.
      const indexTip = landmarks[8];

      handCursor.style.display = 'block';
      handCursor.style.left = `${(1 - indexTip.x) * 100}%`;
      handCursor.style.top = `${indexTip.y * 100}%`;

      if (gesture.isPinching) {
        controlMode.textContent = 'PINCH SELECT';
        handStatus.textContent = 'PINCH DETECTED';
      } else {
        controlMode.textContent = 'HAND TRACKING';
      }

      // Select on the start of a pinch, with a cooldown.
      const now = performance.now();

      if (
        gesture.isPinching &&
        !wasPinching &&
        now - lastPinchSelectionTime >= PINCH_COOLDOWN
      ) {
        lastPinchSelectionTime = now;

        pointer.x = (1 - indexTip.x) * 2 - 1;
        pointer.y = 1 - indexTip.y * 2;

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(
          assembly.children,
          false
        );

        if (hits.length > 0) {
          // Use the same selection function as mouse clicks.
          selectComponent(hits[0].object);
        }
      }

      wasPinching = gesture.isPinching;

      // Open palm toggles automatic rotation once per gesture.
      if (gesture.isOpenPalm && !wasOpenPalm) {
        isRotating = !isRotating;

        document.querySelector('#rotate').textContent =
          isRotating ? 'Ⅱ Pause Rotation' : '⟳ Resume Rotation';
      }

      wasOpenPalm = gesture.isOpenPalm;
    } else {
      // No hand is currently visible.
      previousHandX = null;
      previousHandY = null;

      handStatus.textContent = 'SHOW YOUR HAND';
      trackingStatus.textContent = 'NO HAND DETECTED';
      trackingStatus.previousElementSibling.style.background = '#718096';

      gestureName.textContent = 'NO HAND DETECTED';
      gestureHint.textContent = 'Show your hand to the camera';
      handCursor.style.display = 'none';

      wasOpenPalm = false;
      wasPinching = false;
    }
  }

  requestAnimationFrame(detectHand);
}

// -------------------- CAMERA ON/OFF BUTTON --------------------

cameraButton.addEventListener('click', async () => {
  if (webcamRunning) {
    webcamRunning = false;

    webcam.srcObject?.getTracks().forEach(track => track.stop());
    webcam.srcObject = null;

    handLandmarker?.close();
    handLandmarker = null;

    handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);

    previousHandX = null;
    previousHandY = null;
    wasOpenPalm = false;
    wasPinching = false;

    handCursor.style.display = 'none';

    handStatus.textContent = 'CAMERA OFF';
    controlMode.textContent = 'MOUSE + KEYBOARD';
    trackingStatus.textContent = 'CAMERA OFF';
    trackingStatus.previousElementSibling.style.background = '#718096';

    gestureName.textContent = 'NO HAND DETECTED';
    gestureHint.textContent = 'Enable hand tracking to begin';

    cameraButton.textContent = 'Enable Hand Tracking';
  } else {
    await startHandTracking();
  }
});