
import { recognizeGesture } from './gestureRecognition.js';

export function createGestureControls({
  assembly,
  selection,
  selectComponent,
  toggleRotation,
  onGestureUpdate,
  onHandStatus,
  onControlModeUpdate,
  handCursor
}) {
  let previousHandX = null;
  let previousHandY = null;

  let wasOpenPalm = false;
  let wasPinching = false;
  let lastPinchSelectionTime = 0;

  const PINCH_COOLDOWN = 500;

  function handleLandmarks(landmarks) {
    const gesture = recognizeGesture(landmarks);

    onGestureUpdate?.(gesture);

    // Rotate the assembly using palm movement.
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

    onHandStatus?.('HAND DETECTED');

    // Move the cursor to the index fingertip.
    const indexTip = landmarks[8];

    handCursor.style.display = 'block';
    handCursor.style.left = `${(1 - indexTip.x) * 100}%`;
    handCursor.style.top = `${indexTip.y * 100}%`;

    // Pinch selection with cooldown.
    if (gesture.isPinching) {
      onControlModeUpdate?.('PINCH SELECT');

      const now = performance.now();

      if (
        !wasPinching &&
        now - lastPinchSelectionTime >= PINCH_COOLDOWN
      ) {
        lastPinchSelectionTime = now;

        const mesh = selection.pickAtNdc(
          (1 - indexTip.x) * 2 - 1,
          1 - indexTip.y * 2
        );

        if (mesh) {
          selectComponent(mesh);
        }
      }
    } else {
      onControlModeUpdate?.('HAND TRACKING');
    }

    wasPinching = gesture.isPinching;

    // Open palm toggles automatic rotation once per gesture.
    if (gesture.isOpenPalm && !wasOpenPalm) {
      toggleRotation();
    }

    wasOpenPalm = gesture.isOpenPalm;
  }

  function handleNoHand() {
    previousHandX = null;
    previousHandY = null;

    wasOpenPalm = false;
    wasPinching = false;

    handCursor.style.display = 'none';

    onHandStatus?.('SHOW YOUR HAND');
    onControlModeUpdate?.('HAND TRACKING');

    onGestureUpdate?.({
      name: 'NO HAND DETECTED',
      hint: 'Show your hand to the camera',
      isPinching: false,
      isOpenPalm: false
    });
  }

  function reset() {
    handleNoHand();
    lastPinchSelectionTime = 0;
  }

  return {
    handleLandmarks,
    handleNoHand,
    reset
  };
}
