// ============================================================================
// GESTURE CONTROLS COORDINATOR
// Translates computer vision hand landmarks into 3D navigation and surgical selection
// ============================================================================

import { recognizeGesture } from './gestureRecognition.js';

export function createGestureControls({
  getActiveOrganGroup,
  camera,
  controls,
  selection,
  onSelectHit,
  toggleRotation,
  toggleExplodedView,
  heartAudio,
  onGestureUpdate,
  onHandStatus,
  onControlModeUpdate,
  handCursor
}) {
  let prevHandX = null;
  let prevHandY = null;
  let prevZoomDist = null;

  let wasOpenPalm = false;
  let wasPinching = false;
  let wasThumbsUp = false;
  let lastPinchTime = 0;
  const PINCH_COOLDOWN = 450;

  function handleLandmarks(landmarks) {
    if (!landmarks || landmarks.length === 0) {
      handleNoHand();
      return;
    }

    const gesture = recognizeGesture(landmarks);
    onGestureUpdate?.(gesture);
    onHandStatus?.('HAND DETECTED');

    const indexTip = landmarks[8];
    const palm = landmarks[9];

    // 1. Move Cursor to Index Fingertip
    if (handCursor) {
      handCursor.style.display = 'block';
      handCursor.style.left = `${(1 - indexTip.x) * 100}%`;
      handCursor.style.top = `${indexTip.y * 100}%`;

      if (gesture.isPinching) {
        handCursor.classList.add('pinching');
      } else {
        handCursor.classList.remove('pinching');
      }
    }

    // 2. Rotate Organ via Hand Motion (when not open palm)
    const organGroup = getActiveOrganGroup?.();
    if (prevHandX !== null && !gesture.isOpenPalm && !gesture.isZooming) {
      const dx = palm.x - prevHandX;
      const dy = palm.y - prevHandY;
      const deadZone = 0.0025;

      if (Math.abs(dx) > deadZone && organGroup) {
        organGroup.rotation.y -= dx * 3.5;
      }
      if (Math.abs(dy) > deadZone && organGroup) {
        organGroup.rotation.x += dy * 3.0;
      }
    }

    // 3. Two-Finger Zoom
    if (gesture.isZooming && gesture.twoFingerDist !== undefined) {
      if (prevZoomDist !== null && camera && controls) {
        const delta = gesture.twoFingerDist - prevZoomDist;
        if (Math.abs(delta) > 0.005) {
          const zoomSpeed = 8.0;
          camera.position.sub(controls.target);
          camera.position.multiplyScalar(delta > 0 ? (1 - delta * zoomSpeed) : (1 - delta * zoomSpeed));
          camera.position.add(controls.target);
        }
      }
      prevZoomDist = gesture.twoFingerDist;
      onControlModeUpdate?.('GESTURE ZOOM');
    } else {
      prevZoomDist = null;
    }

    // 4. Pinch Raycast Selection
    if (gesture.isPinching) {
      onControlModeUpdate?.('PINCH SELECT');
      const now = performance.now();

      if (!wasPinching && (now - lastPinchTime >= PINCH_COOLDOWN)) {
        lastPinchTime = now;

        const ndcX = (1 - indexTip.x) * 2 - 1;
        const ndcY = 1 - indexTip.y * 2;

        const hit = selection?.pickAtNdc(ndcX, ndcY);
        if (hit) {
          heartAudio?.playSelectChirp();
          onSelectHit?.(hit);
        }
      }
    } else if (!gesture.isZooming) {
      onControlModeUpdate?.('VISION TRACKING');
    }

    // 5. Open Palm -> Toggle Rotation
    if (gesture.isOpenPalm && !wasOpenPalm) {
      toggleRotation?.();
    }

    // 6. Thumbs Up -> Toggle Dissection View
    if (gesture.isThumbsUp && !wasThumbsUp) {
      toggleExplodedView?.();
    }

    wasOpenPalm = gesture.isOpenPalm;
    wasPinching = gesture.isPinching;
    wasThumbsUp = gesture.isThumbsUp;

    prevHandX = palm.x;
    prevHandY = palm.y;
  }

  function handleNoHand() {
    prevHandX = null;
    prevHandY = null;
    prevZoomDist = null;
    wasOpenPalm = false;
    wasPinching = false;
    wasThumbsUp = false;

    if (handCursor) {
      handCursor.style.display = 'none';
    }

    onHandStatus?.('SHOW YOUR HAND');
    onControlModeUpdate?.('MOUSE / TOUCH');
    onGestureUpdate?.({
      name: 'NO HAND DETECTED',
      icon: '📷',
      hint: 'Bring your hand into the webcam frame to control the 3D organ'
    });
  }

  function reset() {
    handleNoHand();
    lastPinchTime = 0;
  }

  return {
    handleLandmarks,
    handleNoHand,
    reset
  };
}
