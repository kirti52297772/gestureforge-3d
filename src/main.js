
import './style.css';

// Scene
import { createSceneManager } from './scene/sceneManager.js';
import { createAssembly } from './scene/assembly.js';

import {
    loadHeartModel,
    inspectHeartParts
} from './scene/heartLoader.js';

// Features
import { setupComponentSelection } from './features/selection.js';
import { createComponentInspector } from './features/componentInspector.js';
import { createExplodedView } from './features/explodedView.js';
import { setupVisibility } from './features/visibility.js';

// Controls
import { setupKeyboardControls } from './controls/keyboardControls.js';
import { setupMouseControls } from './controls/mouseControls.js';

// Gestures
import { createHandTracker } from './gestures/handTracker.js';
import { createGestureControls } from './gestures/gestureControls.js';

// UI
import { createStatusPanel } from './ui/statusPanel.js';


// ================================================
// 1. INITIALIZE SCENE
// ================================================

const {
  viewer,
  scene,
  camera,
  renderer,
  controls,
  cameraState
} = createSceneManager();

const {
  defaultCameraPosition,
  defaultCameraTarget,
  targetCameraPosition,
  targetCameraTarget
} = cameraState;


// ================================================
// 2. CREATE ASSEMBLY
// ================================================

const { assembly, parts } = createAssembly(scene);

// Load the 3D human heart model
let heartModel = null;

loadHeartModel(scene)
    .then((heart) => {
        heartModel = heart;

        // Hide the old mechanical assembly
        assembly.visible = false;

        console.log('GestureForge Med 3D: Heart is ready!');
    })
    .catch((error) => {
        console.error('Could not load heart model:', error);
    });

   // inspectHeartParts();

// ================================================
// 3. SETUP MOUSE CONTROLS
// ================================================

setupMouseControls(controls);


// ================================================
// 4. COMPONENT INSPECTOR
// ================================================

const inspector = createComponentInspector({
  assembly,
  cameraState
});

const {
  selectComponent,
  clearComponentSelection,
  focusSelectedComponent
} = inspector;


// ================================================
// 5. COMPONENT SELECTION
// ================================================

const selection = setupComponentSelection({
  renderer,
  camera,
  assembly,
  onSelect: selectComponent
});

document
  .querySelector('#focusComponent')
  .addEventListener('click', focusSelectedComponent);

document
  .querySelector('#clearSelection')
  .addEventListener('click', clearComponentSelection);


// ================================================
// 6. COMPONENT VISIBILITY
// ================================================

setupVisibility(parts);


// ================================================
// 7. EXPLODED VIEW
// ================================================

const explodedView = createExplodedView({
  parts,
  assembly,
  explodeButton: document.querySelector('#explode')
});


// ================================================
// 8. ROTATION CONTROL
// ================================================

let isRotating = true;

const rotateButton = document.querySelector('#rotate');

function updateRotationButton() {
  rotateButton.textContent = isRotating
    ? 'Pause Rotation'
    : 'Resume Rotation';
}

function toggleRotation() {
  isRotating = !isRotating;
  updateRotationButton();
}

rotateButton.addEventListener('click', toggleRotation);


// ================================================
// 9. RESET APPLICATION
// ================================================

function resetApplication() {
  assembly.rotation.set(0, 0, 0);
  
      if (heartModel) {
        heartModel.rotation.set(0, 0, 0);
    }

  explodedView.resetExplodedView();

  targetCameraPosition.copy(defaultCameraPosition);
  targetCameraTarget.copy(defaultCameraTarget);

  cameraState.cameraTransition = true;

  clearComponentSelection();

  isRotating = true;
  updateRotationButton();
}

document
  .querySelector('#reset')
  .addEventListener('click', resetApplication);


// ================================================
// 10. KEYBOARD CONTROLS
// ================================================

setupKeyboardControls({
  assembly,
  camera,
  controls,

  onToggleRotation: toggleRotation,

  onReset: resetApplication,

  onToggleExplodedView: explodedView.toggleExplodedView,

  onClearSelection: clearComponentSelection
});


// ================================================
// 11. PERFORMANCE MONITOR
// ================================================

const statusPanel = createStatusPanel();


// ================================================
// 12. GESTURE UI ELEMENTS
// ================================================

const cameraButton = document.querySelector('#cameraButton');

const webcam = document.querySelector('#webcam');

const handCanvas = document.querySelector('#handCanvas');

const handStatus = document.querySelector('#handStatus');

const controlMode = document.querySelector('#controlMode');

const trackingStatus = document.querySelector('#trackingStatus');

const gestureName = document.querySelector('#gestureName');

const gestureHint = document.querySelector('#gestureHint');

const handCursor = document.querySelector('#handCursor');

const trackingDot = trackingStatus.previousElementSibling;


// ================================================
// 13. GESTURE DISPLAY FUNCTIONS
// ================================================

function updateGestureDisplay(gesture) {
  gestureName.textContent = gesture.name;
  gestureHint.textContent = gesture.hint;
}

function updateHandStatus(status) {
  handStatus.textContent = status;

  if (status === 'HAND DETECTED') {
    trackingStatus.textContent = 'HAND TRACKING ACTIVE';
    trackingDot.style.background = '#39e58c';
  } else {
    trackingStatus.textContent =
      status === 'SHOW YOUR HAND'
        ? 'NO HAND DETECTED'
        : status;

    trackingDot.style.background = '#718096';
  }
}

function updateControlMode(mode) {
  controlMode.textContent = mode;
}


// ================================================
// 14. GESTURE CONTROLS
// ================================================

const gestureControls = createGestureControls({
  assembly,
  selection,
  selectComponent,
  toggleRotation,

  onGestureUpdate: updateGestureDisplay,

  onHandStatus: updateHandStatus,

  onControlModeUpdate: updateControlMode,

  handCursor
});


// ================================================
// 15. MEDIAPIPE HAND TRACKER
// ================================================

const handTracker = createHandTracker({
  video: webcam,
  canvas: handCanvas,

  onLandmarks: gestureControls.handleLandmarks,

  onNoHand: gestureControls.handleNoHand,

  onStatus: status => {
    if (status === 'ACTIVE') {
      handStatus.textContent = 'CAMERA ACTIVE';

      controlMode.textContent = 'HAND TRACKING';

      trackingStatus.textContent = 'SHOW YOUR HAND';

      trackingDot.style.background = '#718096';

      cameraButton.textContent = 'Stop Hand Tracking';

      cameraButton.disabled = false;
    }

    if (status === 'LOADING') {
      cameraButton.textContent = 'Loading hand tracking...';

      cameraButton.disabled = true;
    }

    if (status === 'ERROR') {
      handStatus.textContent = 'CAMERA ERROR';

      trackingStatus.textContent = 'CAMERA ERROR';

      cameraButton.textContent = 'Try Again';

      cameraButton.disabled = false;

      controlMode.textContent = 'MOUSE + KEYBOARD';
    }

    if (status === 'OFF') {
      handStatus.textContent = 'CAMERA OFF';

      trackingStatus.textContent = 'CAMERA OFF';

      trackingDot.style.background = '#718096';

      controlMode.textContent = 'MOUSE + KEYBOARD';

      cameraButton.textContent = 'Enable Hand Tracking';

      cameraButton.disabled = false;

      gestureName.textContent = 'NO HAND DETECTED';

      gestureHint.textContent = 'Enable hand tracking to begin';

      handCursor.style.display = 'none';
    }
  }
});


// ================================================
// 16. CAMERA ON / OFF
// ================================================

cameraButton.addEventListener('click', async () => {
  if (handTracker.isRunning()) {
    handTracker.stop();

    gestureControls.reset();

    return;
  }

  try {
    await handTracker.start();
  } catch (error) {
    console.error('Hand tracking could not start:', error);

    alert(
      'Unable to start the camera. Please check browser camera permissions.'
    );
  }
});


// ================================================
// 17. RESPONSIVE RESIZE
// ================================================

function resize() {
  const width = Math.max(viewer.clientWidth, 1);

  const height = Math.max(viewer.clientHeight, 1);

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

resize();


// ================================================
// 18. ANIMATION LOOP
// ================================================

function animate() {
  requestAnimationFrame(animate);

  // Automatic assembly rotation.
  // Automatic 3D model rotation.
if (isRotating) {
    if (heartModel) {
        heartModel.rotation.y += 0.004;
    } else {
        assembly.rotation.y += 0.004;
    }
}

  // Smooth camera movement.
  if (cameraState.cameraTransition) {
    camera.position.lerp(targetCameraPosition, 0.12);

    controls.target.lerp(targetCameraTarget, 0.12);

    const positionClose =
      camera.position.distanceTo(targetCameraPosition) < 0.01;

    const targetClose =
      controls.target.distanceTo(targetCameraTarget) < 0.01;

    if (positionClose && targetClose) {
      camera.position.copy(targetCameraPosition);

      controls.target.copy(targetCameraTarget);

      cameraState.cameraTransition = false;
    }
  }

  controls.update();

  renderer.render(scene, camera);

  statusPanel.updatePerformanceMonitor();
}


// ================================================
// 19. START APPLICATION
// ================================================

animate();

statusPanel.setEngineStatus('ONLINE');

console.log('GestureForge 3D initialized successfully.');
