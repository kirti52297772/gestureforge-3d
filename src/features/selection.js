
import * as THREE from 'three';

export function setupComponentSelection({
  renderer,
  camera,
  assembly,
  onSelect
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Find the component at a given normalized device coordinate.
  function pickAtNdc(x, y) {
    pointer.set(x, y);

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(
      assembly.children,
      true
    );

    if (intersections.length === 0) {
      return null;
    }

    return intersections[0].object;
  }

  // Convert browser mouse coordinates into Three.js coordinates.
  function handleMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    const y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const selectedMesh = pickAtNdc(x, y);

    if (selectedMesh) {
      onSelect?.(selectedMesh);
    }
  }

  renderer.domElement.addEventListener(
    'click',
    handleMouseClick
  );

  // Return the reusable selection function for hand gestures.
  return {
    pickAtNdc,

    dispose() {
      renderer.domElement.removeEventListener(
        'click',
        handleMouseClick
      );
    }
  };
}
