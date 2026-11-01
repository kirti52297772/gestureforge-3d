
import './style.css';

import * as THREE from 'three';

// ================================================
// 1. SCENE
// ================================================

import { createSceneManager } from './scene/sceneManager.js';
import { createAssembly } from './scene/assembly.js';

import {
    loadHeartModel,
    loadHeartComparisonModels
} from './scene/heartLoader.js';

// ================================================
// 2. FEATURES
// ================================================

import { setupComponentSelection } from './features/selection.js';
import { createComponentInspector } from './features/componentInspector.js';
import { createExplodedView } from './features/explodedView.js';
import { setupVisibility } from './features/visibility.js';

// ================================================
// 3. CONTROLS
// ================================================

import { setupKeyboardControls } from './controls/keyboardControls.js';
import { setupMouseControls } from './controls/mouseControls.js';

// ================================================
// 4. GESTURES
// ================================================

import { createHandTracker } from './gestures/handTracker.js';
import { createGestureControls } from './gestures/gestureControls.js';

// ================================================
// 5. UI
// ================================================

import { createStatusPanel } from './ui/statusPanel.js';


// ================================================
// 6. INITIALIZE SCENE
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
// 7. CREATE ORIGINAL MECHANICAL ASSEMBLY
// ================================================

const { assembly, parts } = createAssembly(scene);


// ================================================
// 8. HEART MODEL VARIABLES
// ================================================

let heartModel = null;
let comparisonGroup = null;


// ================================================
// 9. FRAME HEART MODELS AUTOMATICALLY
// ================================================

function frameComparisonModels() {

    if (!comparisonGroup) return;

    // Update model world positions
    comparisonGroup.updateMatrixWorld(true);

    // Calculate complete model boundaries
    const bounds = new THREE.Box3().setFromObject(comparisonGroup);

    // Calculate bounding sphere
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());

    const modelCenter = sphere.center;
    const modelRadius = sphere.radius;

    console.log('MODEL CENTER:', modelCenter.toArray());
    console.log('MODEL RADIUS:', modelRadius);

    // Calculate vertical and horizontal camera field of view
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);

    const horizontalFov = 2 * Math.atan(
        Math.tan(verticalFov / 2) * camera.aspect
    );

    // Use the smaller field of view
    const limitingFov = Math.min(verticalFov, horizontalFov);

    // Calculate camera distance
    const distance = (
        modelRadius / Math.sin(limitingFov / 2)
    ) * 1.35;

    // Disable previous camera animation
    cameraState.cameraTransition = false;

    // Position camera
    camera.position.set(
        modelCenter.x,
        modelCenter.y,
        modelCenter.z + distance
    );

    // Point camera towards models
    controls.target.copy(modelCenter);

    // Camera clipping settings
    camera.near = 0.1;
    camera.far = Math.max(1000, distance * 5);

    // Zoom settings
    controls.minDistance = 1;
    controls.maxDistance = Math.max(100, distance * 3);

    camera.lookAt(modelCenter);

    camera.updateProjectionMatrix();
    controls.update();

    console.log('CAMERA POSITION:', camera.position.toArray());
    console.log('CAMERA DISTANCE:', distance);

    // Inspect visible meshes
    comparisonGroup.traverse((child) => {

        if (child.isMesh) {

            console.log('MODEL CHECK:', {
                name: child.name,
                visible: child.visible,
                position: child.getWorldPosition(
                    new THREE.Vector3()
                ).toArray()
            });

        }

    });

}


// ================================================
// 10. LOAD HEART MODELS
// ================================================

loadHeartModel(scene)

    .then(async (heart) => {

        heartModel = heart;

        // Hide original single heart model
        heartModel.visible = false;

        // Hide mechanical assembly
        assembly.visible = false;

        // Load all four NIH comparison models
        comparisonGroup = await loadHeartComparisonModels(scene);

        console.log('All four comparison models loaded.');

        // Automatically frame all models
        frameComparisonModels();

        console.log('GestureForge Med 3D: Heart comparison viewer ready!');

    })

    .catch((error) => {

        console.error('Could not load heart models:', error);

    });


// Keep inspection disabled for normal application startup
// inspectHeartParts();


// ================================================
// 11. MOUSE CONTROLS
// ================================================

setupMouseControls(controls);


// ================================================
// 12. COMPONENT INSPECTOR
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
// 13. COMPONENT SELECTION
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
// 14. COMPONENT VISIBILITY
// ================================================

setupVisibility(parts);


// ================================================
// 15. EXPLODED VIEW
// ================================================

const explodedView = createExplodedView({
    parts,
    assembly,
    explodeButton: document.querySelector('#explode')
});


// ================================================
// 16. ROTATION CONTROL
// ================================================

let isRotating = false ;

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
// 17. RESET APPLICATION
// ================================================

function resetApplication() {

    // Reset mechanical assembly
    assembly.rotation.set(0, 0, 0);

    // Reset original heart
    if (heartModel) {
        heartModel.rotation.set(0, 0, 0);
    }

    // Reset comparison models
    if (comparisonGroup) {
        comparisonGroup.rotation.set(0, 0, 0);
        frameComparisonModels();
    } else {

        targetCameraPosition.copy(defaultCameraPosition);
        targetCameraTarget.copy(defaultCameraTarget);

        cameraState.cameraTransition = true;

    }

    // Reset exploded view
    explodedView.resetExplodedView();

    // Clear component selection
    clearComponentSelection();

    // Resume rotation
    isRotating = true;

    updateRotationButton();

}

document
    .querySelector('#reset')
    .addEventListener('click', resetApplication);


// ================================================
// 18. KEYBOARD CONTROLS
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
// 19. PERFORMANCE MONITOR
// ================================================

const statusPanel = createStatusPanel();


// ================================================
// 20. GESTURE UI ELEMENTS
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
// 21. GESTURE DISPLAY FUNCTIONS
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
// 22. GESTURE CONTROLS
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
// 23. MEDIAPIPE HAND TRACKER
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
// 24. CAMERA ON / OFF
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
// 25. RESPONSIVE RESIZE
// ================================================

function resize() {

    const width = Math.max(viewer.clientWidth, 1);

    const height = Math.max(viewer.clientHeight, 1);

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // Reframe models when viewer dimensions change
    if (comparisonGroup) {
        frameComparisonModels();
    }

}

window.addEventListener('resize', resize);

resize();


// ================================================
// 26. ANIMATION LOOP
// ================================================

function animate() {

    requestAnimationFrame(animate);

    // Rotate comparison models
    if (isRotating) {

        if (comparisonGroup) {

            comparisonGroup.rotation.y += 0.004;

        } else if (heartModel) {

            heartModel.rotation.y += 0.004;

        } else {

            assembly.rotation.y += 0.004;

        }

    }

    // Smooth camera transitions
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

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);

    // Update performance monitor
    statusPanel.updatePerformanceMonitor();

}


// ================================================
// 27. START APPLICATION
// ================================================

animate();

statusPanel.setEngineStatus('ONLINE');

console.log('GestureForge Med 3D initialized successfully.');
