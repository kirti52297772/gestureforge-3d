// ============================================================================
// COMPUTER VISION GESTURE RECOGNITION ENGINE
// Detects Pinch, Open Palm, Fist, Pointing, Peace (Zoom), and Thumbs-Up from MediaPipe
// ============================================================================

export function isFingerExtended(landmarks, tipIndex, jointIndex) {
  const wrist = landmarks[0];
  const tip = landmarks[tipIndex];
  const joint = landmarks[jointIndex];

  const tipDist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
  const jointDist = Math.hypot(joint.x - wrist.x, joint.y - wrist.y);

  return tipDist > jointDist * 1.15;
}

export function recognizeGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return { name: 'NO HAND DETECTED', hint: 'Show your hand to the camera', icon: '❓' };
  }

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  const wrist = landmarks[0];

  const indexUp = isFingerExtended(landmarks, 8, 5);
  const middleUp = isFingerExtended(landmarks, 12, 9);
  const ringUp = isFingerExtended(landmarks, 16, 13);
  const pinkyUp = isFingerExtended(landmarks, 20, 17);

  // Pinch distance (Thumb Tip to Index Tip)
  const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

  // 1. PINCH (Selection)
  if (pinchDist < 0.055) {
    return {
      name: 'PINCH SELECT',
      icon: '🤏',
      hint: 'Pinching: Selects anatomical hotspot or mesh in 3D',
      isPinching: true,
      isOpenPalm: false,
      isFist: false,
      isPointing: false,
      isZooming: false,
      isThumbsUp: false
    };
  }

  // 2. THUMBS UP (Dissection Toggle)
  const thumbUp = thumbTip.y < wrist.y - 0.15 && thumbTip.y < indexTip.y - 0.08;
  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    return {
      name: 'THUMBS UP',
      icon: '👍',
      hint: 'Thumbs Up: Toggle surgical dissection view',
      isPinching: false,
      isOpenPalm: false,
      isFist: false,
      isPointing: false,
      isZooming: false,
      isThumbsUp: true
    };
  }

  // 3. PEACE / VICTORY (Zoom Mode)
  if (indexUp && middleUp && !ringUp && !pinkyUp) {
    const twoFingerDist = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);
    return {
      name: 'TWO-FINGER ZOOM',
      icon: '✌️',
      hint: 'Two Fingers: Move forward/backward to Zoom in & out',
      isPinching: false,
      isOpenPalm: false,
      isFist: false,
      isPointing: false,
      isZooming: true,
      twoFingerDist,
      isThumbsUp: false
    };
  }

  // 4. POINTING (Laser Crosshair)
  if (indexUp && !middleUp && !ringUp && !pinkyUp) {
    return {
      name: 'POINTING INSPECT',
      icon: '☝️',
      hint: 'Index Pointing: Targeting anatomical coordinates',
      isPinching: false,
      isOpenPalm: false,
      isFist: false,
      isPointing: true,
      isZooming: false,
      isThumbsUp: false
    };
  }

  // 5. OPEN PALM (Pause / Freeze Rotation)
  if (indexUp && middleUp && ringUp && pinkyUp) {
    return {
      name: 'OPEN PALM',
      icon: '🖐️',
      hint: 'Open Palm: Toggle / Freeze organ rotation',
      isPinching: false,
      isOpenPalm: true,
      isFist: false,
      isPointing: false,
      isZooming: false,
      isThumbsUp: false
    };
  }

  // 6. FIST (Grab & Orbit Rotate)
  if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
    return {
      name: 'FIST GRAB',
      icon: '✊',
      hint: 'Closed Fist: Move hand to orbit & rotate 3D organ',
      isPinching: false,
      isOpenPalm: false,
      isFist: true,
      isPointing: false,
      isZooming: false,
      isThumbsUp: false
    };
  }

  return {
    name: 'HAND TRACKED',
    icon: '👋',
    hint: 'Move hand to navigate, pinch to select, open palm to pause',
    isPinching: false,
    isOpenPalm: false,
    isFist: false,
    isPointing: false,
    isZooming: false,
    isThumbsUp: false
  };
}
