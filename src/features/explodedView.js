
export function createExplodedView({ parts, assembly, explodeButton }) {
  let isExploded = false;

  function toggleExplodedView() {
    isExploded = !isExploded;

    parts.forEach(({ mesh, originalPosition }) => {
      if (isExploded) {
        const direction = originalPosition.clone();

        if (direction.length() < 0.2) {
          direction.set(0, 1, 0);
        }

        direction.normalize();

        mesh.position.copy(originalPosition)
          .add(direction.multiplyScalar(0.8));
      } else {
        mesh.position.copy(originalPosition);
      }
    });

    explodeButton.textContent =
      isExploded ? 'Reassemble Parts' : 'Exploded View';
  }

  function resetExplodedView() {
    isExploded = false;

    parts.forEach(({ mesh, originalPosition }) => {
      mesh.position.copy(originalPosition);
    });

    explodeButton.textContent = 'Exploded View';
  }

  explodeButton.addEventListener('click', toggleExplodedView);

  return {
    toggleExplodedView,
    resetExplodedView,
    isExploded: () => isExploded
  };
}
