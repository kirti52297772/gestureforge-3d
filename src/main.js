// ============================================================================
// GESTUREFORGE MED 3D — MAIN APPLICATION ENTRY POINT
// Surgical 3D Anatomy, Computer Vision Gesture Controls, ECG, Case Studies & Wiki
// ============================================================================

import './style.css';
import * as THREE from 'three';

// 1. Scene & Organ Engines
import { createSceneManager } from './scene/sceneManager.js';
import { loadCardiacModelSuite, setHeartXRayMode } from './scene/heartLoader.js';
import { createOrganModel } from './scene/organBuilder.js';
import { HEART_ANATOMY } from './data/heartAnatomy.js';
import { ORGANS, getOrganById } from './data/organsData.js';

// 2. Audio & ECG Monitoring
import { createHeartAudio } from './audio/heartAudio.js';
import { createEcgMonitor } from './ui/ecgMonitor.js';

// 3. UI Panels & Modals
import { createAnatomyPanel } from './ui/anatomyPanel.js';
import { createCaseStudyPanel } from './ui/caseStudyPanel.js';
import { createWikipediaModal } from './ui/wikipediaModal.js';
import { createStatusPanel } from './ui/statusPanel.js';

// 4. Features & Controls
import { createExplodedView } from './features/explodedView.js';
import { setupComponentSelection } from './features/selection.js';
import { createComponentInspector } from './features/componentInspector.js';
import { setupMouseControls } from './controls/mouseControls.js';
import { setupKeyboardControls } from './controls/keyboardControls.js';

// 5. Computer Vision & Hand Tracking
import { createHandTracker } from './gestures/handTracker.js';
import { createGestureControls } from './gestures/gestureControls.js';

// ============================================================================
// INITIALIZE 3D SCENE & WORKSTATION
// ============================================================================

const {
  viewer,
  scene,
  camera,
  renderer,
  controls,
  cameraState,
  focusOn,
  resetCamera
} = createSceneManager();

const statusPanel = createStatusPanel();
const heartAudio = createHeartAudio();
const wikiModal = createWikipediaModal();
const caseStudyPanel = createCaseStudyPanel();

// ============================================================================
// REAL-TIME ECG MONITOR
// ============================================================================

const ecgCanvas = document.querySelector('#ecgCanvas');
let cardiacPhase = 0; // 0 to 1

const ecgMonitor = createEcgMonitor({
  canvas: ecgCanvas,
  heartAudio,
  onBeat: (stage) => {
    // Cardiac pulse deformation
    if (activeOrganId === 'heart' && cardiacModelSuite) {
      if (stage === 'systole') {
        triggerSystolicContraction();
      }
    }
  }
});

// BPM Slider
const bpmSlider = document.querySelector('#bpmSlider');
const bpmSliderLabel = document.querySelector('#bpmSliderLabel');
const bpmValueTop = document.querySelector('#bpmValue');

if (bpmSlider) {
  bpmSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    ecgMonitor.setBpm(val);
    if (bpmSliderLabel) bpmSliderLabel.textContent = `${val} BPM`;
    if (bpmValueTop) bpmValueTop.textContent = val;
  });
}

// Audio Stethoscope Toggle
const audioToggleBtn = document.querySelector('#audioToggleBtn');
const audioIcon = document.querySelector('#audioIcon');

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    const unmuted = heartAudio.toggleMute();
    audioToggleBtn.classList.toggle('active', unmuted);
    if (audioIcon) audioIcon.textContent = unmuted ? '🔊' : '🔇';
  });
}

// ============================================================================
// DISSECTION & EXPLODED VIEW ENGINE
// ============================================================================

const explodeButton = document.querySelector('#explode');
const explodedView = createExplodedView({
  explodeButton,
  onExplodeChange: (isExploded) => {
    console.log('Dissection mode changed:', isExploded);
  }
});

// ============================================================================
// ORGAN MANAGEMENT SYSTEM
// ============================================================================

let activeOrganId = 'heart';
let activeOrganGroup = null;
let cardiacModelSuite = null;
let isXRayMode = false;
let isRotating = true;

// Heart systolic pulsation state
let systolicScale = 1.0;
let targetSystolicScale = 1.0;

function triggerSystolicContraction() {
  targetSystolicScale = 0.94; // 6% ventricular wall contraction
  setTimeout(() => {
    targetSystolicScale = 1.0; // Diastolic recoil
  }, 160);
}

// Root container for all organs in scene
const organContainer = new THREE.Group();
organContainer.name = 'Organ Container';
scene.add(organContainer);

// Load Initial Heart Model
async function initCardiacModel() {
  try {
    statusPanel.setEngineStatus('LOADING 3D HEART');
    const suite = await loadCardiacModelSuite(scene);
    cardiacModelSuite = suite;
    activeOrganGroup = suite.group;
    organContainer.add(suite.group);

    explodedView.setParts(suite.dissectibleParts);
    anatomyPanel.setParts(HEART_ANATOMY);

    statusPanel.setEngineStatus('ONLINE');
    console.log('Cardiac model suite loaded successfully.');
  } catch (err) {
    console.error('Failed to load cardiac models:', err);
    statusPanel.setEngineStatus('LOAD ERROR');
  }
}

// Switch between Organs (Heart, Brain, Lungs, Kidney, Eye)
async function switchOrgan(organId) {
  if (organId === activeOrganId && activeOrganGroup) return;

  activeOrganId = organId;
  const organMeta = getOrganById(organId);

  // Update HUD
  const hudActiveOrgan = document.querySelector('#hudActiveOrgan');
  if (hudActiveOrgan) {
    hudActiveOrgan.textContent = organMeta.name.toUpperCase();
  }

  // Clear current active group from container
  while (organContainer.children.length > 0) {
    organContainer.remove(organContainer.children[0]);
  }

  // Reset controls & inspector
  inspector.clearComponentSelection();
  explodedView.resetExplodedView();
  resetCamera();

  if (organId === 'heart') {
    if (cardiacModelSuite) {
      activeOrganGroup = cardiacModelSuite.group;
      organContainer.add(activeOrganGroup);
      explodedView.setParts(cardiacModelSuite.dissectibleParts);
      anatomyPanel.setParts(HEART_ANATOMY);
    } else {
      await initCardiacModel();
    }
  } else {
    // Build procedural 3D model
    const newOrgan = createOrganModel(organId);
    if (newOrgan) {
      activeOrganGroup = newOrgan;
      organContainer.add(newOrgan);

      // Collect dissectible sub-parts
      const parts = [];
      newOrgan.traverse(child => {
        if (child.isMesh && child.userData.explodeDir) {
          parts.push({
            object: child,
            originalPosition: child.position.clone(),
            explodeVector: child.userData.explodeDir.clone()
          });
        }
      });
      explodedView.setParts(parts);

      // Set anatomy hierarchy data
      anatomyPanel.setParts(organMeta.parts || []);
    }
  }

  // Update active pill styling
  document.querySelectorAll('.organ-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-organ') === organId);
  });
}

// Organ Switcher Event Listeners
document.querySelectorAll('.organ-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    const organId = btn.getAttribute('data-organ');
    switchOrgan(organId);
  });
});

// ============================================================================
// INSPECTOR & ANATOMY SELECTION
// ============================================================================

const inspector = createComponentInspector({
  cameraState,
  focusOn,
  onOpenWiki: (part) => {
    wikiModal.openForPart(part);
  },
  onOpenCaseStudy: (part) => {
    switchInspectorTab('tab-case-study');
    caseStudyPanel.render(part);
  }
});

const anatomyPanel = createAnatomyPanel({
  onSelectPart: (part) => {
    inspector.selectAnatomicalPart(part);
    caseStudyPanel.render(part);

    // Auto focus camera
    inspector.focusCurrent();
  },
  onOpenWiki: (part) => {
    wikiModal.openForPart(part);
  }
});

// 3D Raycasting Selection
const selection = setupComponentSelection({
  renderer,
  camera,
  scene,
  onSelect: (hit) => {
    if (!hit) return;

    if (hit.type === 'pin' && hit.partData) {
      anatomyPanel.setSelectedPart(hit.partData.id);
      inspector.selectAnatomicalPart(hit.partData, hit.object);
      caseStudyPanel.render(hit.partData);
      heartAudio.playSelectChirp();
    } else if (hit.type === 'mesh') {
      const partId = hit.partId;
      let partData = null;

      if (activeOrganId === 'heart') {
        partData = HEART_ANATOMY.find(p => p.id === partId);
      } else {
        const organMeta = getOrganById(activeOrganId);
        partData = (organMeta.parts || []).find(p => p.id === partId);
      }

      if (partData) {
        anatomyPanel.setSelectedPart(partData.id);
        inspector.selectAnatomicalPart(partData, hit.object);
        caseStudyPanel.render(partData);
      } else {
        inspector.selectAnatomicalPart({
          name: hit.partName || 'Anatomical Structure',
          shortDescription: 'Examining tissue layer in 3D perspective.'
        }, hit.object);
      }
      heartAudio.playSelectChirp();
    }
  }
});

// ============================================================================
// INSPECTOR TABS SWITCHER
// ============================================================================

function switchInspectorTab(tabId) {
  document.querySelectorAll('.inspector-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

document.querySelectorAll('.inspector-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchInspectorTab(btn.getAttribute('data-tab'));
  });
});

// ============================================================================
// ROTATION & X-RAY CONTROLS
// ============================================================================

const rotateButton = document.querySelector('#rotate');

function toggleRotation() {
  isRotating = !isRotating;
  if (rotateButton) {
    rotateButton.innerHTML = isRotating ? '<span>⏸</span> Pause Orbit' : '<span>▶</span> Resume Orbit';
    rotateButton.classList.toggle('active', !isRotating);
  }
  return isRotating;
}

if (rotateButton) {
  rotateButton.addEventListener('click', toggleRotation);
}

const xrayButton = document.querySelector('#xrayToggle');

function toggleXRay() {
  isXRayMode = !isXRayMode;
  if (cardiacModelSuite && activeOrganId === 'heart') {
    setHeartXRayMode(cardiacModelSuite.group, isXRayMode);
  } else if (activeOrganGroup) {
    setHeartXRayMode(activeOrganGroup, isXRayMode);
  }
  if (xrayButton) {
    xrayButton.classList.toggle('active', isXRayMode);
  }
}

if (xrayButton) {
  xrayButton.addEventListener('click', toggleXRay);
}

// Reset Button
const resetButton = document.querySelector('#reset');
if (resetButton) {
  resetButton.addEventListener('click', () => {
    if (activeOrganGroup) {
      activeOrganGroup.rotation.set(0, 0, 0);
    }
    explodedView.resetExplodedView();
    inspector.clearComponentSelection();
    resetCamera();
  });
}

// Setup Mouse & Keyboard Controls
setupMouseControls(controls);

setupKeyboardControls({
  getActiveOrganGroup: () => activeOrganGroup,
  camera,
  controls,
  onToggleRotation: toggleRotation,
  onReset: () => {
    if (activeOrganGroup) activeOrganGroup.rotation.set(0, 0, 0);
    explodedView.resetExplodedView();
    inspector.clearComponentSelection();
    resetCamera();
  },
  onToggleExplodedView: explodedView.toggleExplodedView,
  onToggleXRay: toggleXRay,
  onToggleAudio: () => {
    if (audioToggleBtn) audioToggleBtn.click();
  },
  onSelectOrganIndex: (idx) => {
    if (idx >= 0 && idx < ORGANS.length) {
      switchOrgan(ORGANS[idx].id);
    }
  },
  onClearSelection: inspector.clearComponentSelection
});

// ============================================================================
// COMPUTER VISION & MEDIAPIPE GESTURE CONTROLS
// ============================================================================

const cameraButton = document.querySelector('#cameraButton');
const webcam = document.querySelector('#webcam');
const handCanvas = document.querySelector('#handCanvas');
const handCursor = document.querySelector('#handCursor');

const handStatus = document.querySelector('#handStatus');
const controlMode = document.querySelector('#controlMode');
const gestureName = document.querySelector('#gestureName');
const gestureHint = document.querySelector('#gestureHint');
const gestureIcon = document.querySelector('#gestureIcon');
const gestureDot = document.querySelector('#gestureDot');

const headerVisionText = document.querySelector('#headerVisionText');
const headerVisionDot = document.querySelector('#headerVisionDot');

function updateGestureDisplay(gesture) {
  if (gestureName) gestureName.textContent = gesture.name;
  if (gestureHint) gestureHint.textContent = gesture.hint;
  if (gestureIcon) gestureIcon.textContent = gesture.icon || '👋';
}

function updateHandStatus(status) {
  if (handStatus) handStatus.textContent = status;

  if (status === 'HAND DETECTED') {
    if (gestureDot) gestureDot.style.background = '#39e58c';
    if (headerVisionDot) headerVisionDot.classList.add('active');
    if (headerVisionText) headerVisionText.textContent = 'VISION TRACKING';
  } else {
    if (gestureDot) gestureDot.style.background = '#718096';
    if (headerVisionDot) headerVisionDot.classList.remove('active');
    if (headerVisionText) headerVisionText.textContent = 'CAMERA ACTIVE';
  }
}

function updateControlMode(mode) {
  if (controlMode) controlMode.textContent = mode;
}

const gestureControls = createGestureControls({
  getActiveOrganGroup: () => activeOrganGroup,
  camera,
  controls,
  selection,
  onSelectHit: (hit) => {
    if (hit.type === 'pin' && hit.partData) {
      anatomyPanel.setSelectedPart(hit.partData.id);
      inspector.selectAnatomicalPart(hit.partData, hit.object);
      caseStudyPanel.render(hit.partData);
    } else if (hit.type === 'mesh') {
      const partId = hit.partId;
      let partData = null;
      if (activeOrganId === 'heart') {
        partData = HEART_ANATOMY.find(p => p.id === partId);
      } else {
        const organMeta = getOrganById(activeOrganId);
        partData = (organMeta.parts || []).find(p => p.id === partId);
      }
      if (partData) {
        anatomyPanel.setSelectedPart(partData.id);
        inspector.selectAnatomicalPart(partData, hit.object);
        caseStudyPanel.render(partData);
      }
    }
  },
  toggleRotation,
  toggleExplodedView: explodedView.toggleExplodedView,
  heartAudio,
  onGestureUpdate: updateGestureDisplay,
  onHandStatus: updateHandStatus,
  onControlModeUpdate: updateControlMode,
  handCursor
});

const handTracker = createHandTracker({
  video: webcam,
  canvas: handCanvas,
  onLandmarks: gestureControls.handleLandmarks,
  onNoHand: gestureControls.handleNoHand,
  onStatus: (status) => {
    if (status === 'ACTIVE') {
      if (handStatus) handStatus.textContent = 'CAMERA ACTIVE';
      if (controlMode) controlMode.textContent = 'VISION TRACKING';
      if (headerVisionText) headerVisionText.textContent = 'CAMERA ACTIVE';
      if (headerVisionDot) headerVisionDot.classList.add('active');
      if (cameraButton) {
        cameraButton.innerHTML = '<span>⏹</span> Stop Hand Tracking';
        cameraButton.disabled = false;
      }
    }
    if (status === 'LOADING') {
      if (cameraButton) {
        cameraButton.innerHTML = '<span>⏳</span> Loading MediaPipe Vision AI...';
        cameraButton.disabled = true;
      }
    }
    if (status === 'ERROR') {
      if (handStatus) handStatus.textContent = 'CAMERA ERROR';
      if (headerVisionText) headerVisionText.textContent = 'CAMERA ERROR';
      if (cameraButton) {
        cameraButton.innerHTML = '<span>🔄</span> Try Camera Again';
        cameraButton.disabled = false;
      }
    }
    if (status === 'OFF') {
      if (handStatus) handStatus.textContent = 'CAMERA OFF';
      if (controlMode) controlMode.textContent = 'MOUSE + TOUCH';
      if (headerVisionText) headerVisionText.textContent = 'CAMERA OFF';
      if (headerVisionDot) headerVisionDot.classList.remove('active');
      if (cameraButton) {
        cameraButton.innerHTML = '<span>📷</span> Enable Hand Tracking';
        cameraButton.disabled = false;
      }
      if (gestureName) gestureName.textContent = 'CAMERA OFF';
      if (gestureHint) gestureHint.textContent = 'Enable hand tracking to begin.';
      if (gestureIcon) gestureIcon.textContent = '📷';
      if (handCursor) handCursor.style.display = 'none';
    }
  }
});

if (cameraButton) {
  cameraButton.addEventListener('click', async () => {
    if (handTracker.isRunning()) {
      handTracker.stop();
      gestureControls.reset();
      return;
    }

    try {
      await handTracker.start();
    } catch (err) {
      console.error('Camera could not start:', err);
      alert('Unable to access camera. Please ensure webcam permissions are enabled in your browser.');
    }
  });
}

// ============================================================================
// RESPONSIVE VIEWPORT RESIZING
// ============================================================================

function resizeViewport() {
  const width = Math.max(viewer.clientWidth, 1);
  const height = Math.max(viewer.clientHeight, 1);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resizeViewport);
resizeViewport();

// ============================================================================
// ANIMATION & RENDER LOOP
// ============================================================================

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Continuous subtle organ rotation when orbit is enabled
  if (isRotating && activeOrganGroup) {
    activeOrganGroup.rotation.y += 0.005;
  }

  // Smooth cardiac systolic-diastolic scaling
  systolicScale += (targetSystolicScale - systolicScale) * 0.18;
  if (activeOrganId === 'heart' && cardiacModelSuite && cardiacModelSuite.group) {
    const s = (2.4 / 145.0) * systolicScale;
    cardiacModelSuite.group.scale.setScalar(s);
    cardiacModelSuite.group.position.set(16.76 * -s, -119.96 * -s, -1.09 * -s);
  }

  // Rotate and pulse 3D Pins
  if (cardiacModelSuite && cardiacModelSuite.pins) {
    const time = performance.now() * 0.003;
    cardiacModelSuite.pins.forEach((pin, idx) => {
      const ring = pin.children.find(c => c.userData.isPinRing);
      if (ring) {
        ring.rotation.z += 0.02;
        const scale = 1.0 + Math.sin(time + idx) * 0.15;
        ring.scale.setScalar(scale);
      }
    });
  }

  // Smooth camera transitions when focusing
  if (cameraState.cameraTransition) {
    camera.position.lerp(cameraState.targetCameraPosition, 0.1);
    controls.target.lerp(cameraState.targetCameraTarget, 0.1);

    const posClose = camera.position.distanceTo(cameraState.targetCameraPosition) < 0.02;
    const targetClose = controls.target.distanceTo(cameraState.targetCameraTarget) < 0.02;

    if (posClose && targetClose) {
      camera.position.copy(cameraState.targetCameraPosition);
      controls.target.copy(cameraState.targetCameraTarget);
      cameraState.cameraTransition = false;
    }
  }

  controls.update();
  renderer.render(scene, camera);
  statusPanel.updatePerformanceMonitor();
}

// Start Render Loop & Initialize Model
animate();
initCardiacModel();

console.log('GestureForge Med 3D initialized successfully.');
