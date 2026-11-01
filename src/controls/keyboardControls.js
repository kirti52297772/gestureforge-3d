// ============================================================================
// CLINICAL KEYBOARD SHORTCUTS
// Rapid navigation controls for surgical viewport examination
// ============================================================================

export function setupKeyboardControls({
  getActiveOrganGroup,
  camera,
  controls,
  onToggleRotation,
  onReset,
  onToggleExplodedView,
  onToggleXRay,
  onToggleAudio,
  onSelectOrganIndex,
  onClearSelection
}) {
  function handleKeyDown(event) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    const organ = getActiveOrganGroup?.();

    if (event.code === 'Space') {
      event.preventDefault();
      onToggleRotation?.();
      return;
    }

    switch (key) {
      case 'a':
        if (organ) organ.rotation.y -= 0.12;
        break;
      case 'd':
        if (organ) organ.rotation.y += 0.12;
        break;
      case 'w':
        if (organ) organ.rotation.x -= 0.12;
        break;
      case 's':
        if (organ) organ.rotation.x += 0.12;
        break;

      case 'e':
        onToggleExplodedView?.();
        break;
      case 'x':
        onToggleXRay?.();
        break;
      case 'h':
        onToggleAudio?.();
        break;
      case 'r':
        onReset?.();
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        onSelectOrganIndex?.(parseInt(key, 10) - 1);
        break;

      case '+':
      case '=':
        if (camera && controls) {
          camera.position.addScaledVector(
            camera.position.clone().sub(controls.target).normalize(),
            -0.4
          );
          controls.update();
        }
        break;
      case '-':
      case '_':
        if (camera && controls) {
          camera.position.addScaledVector(
            camera.position.clone().sub(controls.target).normalize(),
            0.4
          );
          controls.update();
        }
        break;

      case 'escape':
        onClearSelection?.();
        break;
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return function removeKeyboardControls() {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
