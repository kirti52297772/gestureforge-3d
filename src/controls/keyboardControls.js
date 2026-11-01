
export function setupKeyboardControls({
  assembly,
  camera,
  controls,
  onToggleRotation,
  onReset,
  onToggleExplodedView,
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

    if (event.code === 'Space') {
      event.preventDefault();
      onToggleRotation();
      return;
    }

    switch (key) {
      case 'a':
        onToggleRotation();
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
          camera.position.clone()
            .sub(controls.target)
            .normalize(),
          -0.5
        );

        camera.position.clampLength(3, 18);
        controls.update();
        break;

      case '-':
      case '_':
        camera.position.addScaledVector(
          camera.position.clone()
            .sub(controls.target)
            .normalize(),
          0.5
        );

        camera.position.clampLength(3, 18);
        controls.update();
        break;

      case 'r':
        onReset();
        break;

      case 'e':
        onToggleExplodedView();
        break;

      case 'escape':
        onClearSelection();
        break;
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return function removeKeyboardControls() {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
