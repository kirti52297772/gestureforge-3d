
export function isFingerExtended(landmarks, tipIndex, jointIndex) {
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

export function recognizeGesture(landmarks) {
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
