
import * as THREE from 'three';

export function createComponentInspector({
  assembly,
  cameraState
}) {
  // DOM elements.
  const inspectName = document.querySelector('#inspectName');
  const inspectType = document.querySelector('#inspectType');
  const inspectDescription = document.querySelector('#inspectDescription');
  const inspectPosition = document.querySelector('#inspectPosition');
  const inspectDimensions = document.querySelector('#inspectDimensions');
  const selectedPartLabel = document.querySelector('#selectedPart');

  let selectedComponent = null;
  let selectedMeshes = [];

  // Description of each mechanical component.
  const componentDescriptions = {
    'Upper Gear':
      'A toothed wheel used to demonstrate rotational motion and component selection.',

    'Middle Gear':
      'A central gear in this demonstration model. Its teeth are grouped for selection.',

    'Lower Gear':
      'A lower toothed wheel used to demonstrate grouped selection and 3D inspection.',

    'Central Shaft':
      'A cylindrical shaft representing a component that can support or transmit rotation.',

    'Central Hub':
      'A central cylindrical feature representing a connection or support point.',

    'Base Plate':
      'The flat base representing a mounting surface for the assembly.'
  };

  // Get the component name stored in the mesh metadata.
  function getComponentName(mesh) {
    return (
      mesh.userData.selectableName ||
      mesh.userData.partName ||
      'Machine Component'
    );
  }

  // Restore original materials after highlighting.
  function restorePreviousMaterials() {
    selectedMeshes.forEach(({
      mesh,
      originalMaterial,
      highlightMaterial
    }) => {
      mesh.material = originalMaterial;

      if (Array.isArray(highlightMaterial)) {
        highlightMaterial.forEach(material => material.dispose());
      } else {
        highlightMaterial.dispose();
      }
    });

    selectedMeshes = [];
  }

  // Clear the selected component and reset inspector values.
  function clearComponentSelection() {
    restorePreviousMaterials();

    selectedComponent = null;

    selectedPartLabel.textContent = 'Gear Assembly';

    inspectName.textContent = 'No component selected';
    inspectType.textContent = '—';

    inspectDescription.textContent =
      'Select a component to see its purpose.';

    inspectPosition.textContent = '—';
    inspectDimensions.textContent = '—';
  }

  // Create highlighted copies of the original materials.
  function createHighlightMaterial(originalMaterial) {
    function highlightSingleMaterial(material) {
      const highlighted = material.clone();

      if (highlighted.emissive) {
        highlighted.emissive.set('#00d9ff');
        highlighted.emissiveIntensity = 0.65;
      }

      return highlighted;
    }

    if (Array.isArray(originalMaterial)) {
      return originalMaterial.map(highlightSingleMaterial);
    }

    return highlightSingleMaterial(originalMaterial);
  }

  // Select and highlight a component.
  function selectComponent(mesh) {
    if (!mesh || !mesh.isMesh) {
      return;
    }

    // Remove highlighting from the previous selection.
    restorePreviousMaterials();

    selectedComponent = mesh;

    const selectedName = getComponentName(mesh);

    // Find all meshes belonging to the same component.
    const matchingParts = assembly.children.filter(
      part =>
        part.isMesh &&
        getComponentName(part) === selectedName
    );

    // Highlight every matching mesh.
    selectedMeshes = matchingParts.map(part => {
      const originalMaterial = part.material;

      const highlightMaterial =
        createHighlightMaterial(originalMaterial);

      part.material = highlightMaterial;

      return {
        mesh: part,
        originalMaterial,
        highlightMaterial
      };
    });

    // Update component name and description.
    selectedPartLabel.textContent = selectedName;
    inspectName.textContent = selectedName;

    inspectType.textContent = mesh.geometry.type.replace(
      'Geometry',
      ''
    );

    inspectDescription.textContent =
      componentDescriptions[selectedName] ||
      'A component of the interactive 3D demonstration assembly.';

    // Calculate the component's world position.
    const worldPosition = new THREE.Vector3();

    mesh.getWorldPosition(worldPosition);

    inspectPosition.textContent = [
      worldPosition.x,
      worldPosition.y,
      worldPosition.z
    ]
      .map(value => value.toFixed(2))
      .join(', ');

    // Calculate dimensions using the selected mesh's bounding box.
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    const size = boundingBox.getSize(new THREE.Vector3());

    inspectDimensions.textContent = [
      size.x,
      size.y,
      size.z
    ]
      .map(value => value.toFixed(2))
      .join(' × ');
  }

  // Smoothly move the camera towards the selected component.
  function focusSelectedComponent() {
    if (!selectedComponent) {
      alert(
        'Select a component first by clicking it or pinching with your hand.'
      );

      return;
    }

    // Include all meshes belonging to the selected component.
    const selectedName = getComponentName(selectedComponent);

    const matchingParts = assembly.children.filter(
      part =>
        part.isMesh &&
        getComponentName(part) === selectedName
    );

    const box = new THREE.Box3();

    matchingParts.forEach(part => {
      box.expandByObject(part);
    });

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const distance =
      Math.max(size.x, size.y, size.z, 0.5) * 3.2;

    const direction = new THREE.Vector3(
      1,
      0.7,
      1
    ).normalize();

    cameraState.targetCameraPosition.copy(
      center.clone().add(
        direction.multiplyScalar(distance)
      )
    );

    cameraState.targetCameraTarget.copy(center);

    cameraState.cameraTransition = true;
  }

  // Public functions available to main.js.
  return {
    selectComponent,
    clearComponentSelection,
    focusSelectedComponent,
    getComponentName,

    getSelectedComponent: () => selectedComponent
  };
}
