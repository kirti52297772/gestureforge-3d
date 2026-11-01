
export function setupMouseControls(controls) {
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;

  controls.minDistance = 3;
  controls.maxDistance = 18;

  return {
    controls
  };
}
