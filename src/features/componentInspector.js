// ============================================================================
// MEDICAL ANATOMY INSPECTOR & TELEMETRY
// Live clinical telemetry, material highlights, camera auto-focus, and wiki integration
// ============================================================================

import * as THREE from 'three';

export function createComponentInspector({
  cameraState,
  focusOn,
  onOpenWiki,
  onOpenCaseStudy
}) {
  const inspectName = document.querySelector('#inspectName');
  const inspectLatin = document.querySelector('#inspectLatin');
  const inspectType = document.querySelector('#inspectType');
  const inspectDescription = document.querySelector('#inspectDescription');
  const inspectHemodynamics = document.querySelector('#inspectHemodynamics');
  const inspectPosition = document.querySelector('#inspectPosition');
  const inspectDimensions = document.querySelector('#inspectDimensions');
  const selectedPartLabel = document.querySelector('#selectedPart');

  const wikiBtn = document.querySelector('#inspectWikiBtn');
  const focusBtn = document.querySelector('#focusComponent');
  const clearBtn = document.querySelector('#clearSelection');

  let currentPart = null;
  let highlightedMeshes = [];

  function clearComponentSelection() {
    restoreMaterials();
    currentPart = null;

    if (selectedPartLabel) selectedPartLabel.textContent = 'None Selected';
    if (inspectName) inspectName.textContent = 'No anatomical structure selected';
    if (inspectLatin) inspectLatin.textContent = 'Select a part in 3D or from the side panel';
    if (inspectType) inspectType.textContent = '—';
    if (inspectDescription) inspectDescription.textContent = 'Explore organs in 3D using your hand gestures or mouse. Click any pin or structure to inspect clinical details.';
    if (inspectHemodynamics) inspectHemodynamics.textContent = '—';
    if (inspectPosition) inspectPosition.textContent = '—';
    if (inspectDimensions) inspectDimensions.textContent = '—';

    if (wikiBtn) wikiBtn.disabled = true;
    if (focusBtn) focusBtn.disabled = true;
  }

  function restoreMaterials() {
    highlightedMeshes.forEach(({ mesh, originalMaterial, highlightMaterial }) => {
      mesh.material = originalMaterial;
      if (highlightMaterial) {
        if (Array.isArray(highlightMaterial)) {
          highlightMaterial.forEach(m => m.dispose());
        } else {
          highlightMaterial.dispose();
        }
      }
    });
    highlightedMeshes = [];
  }

  function selectAnatomicalPart(part, targetObject = null) {
    if (!part) return;

    restoreMaterials();
    currentPart = part;

    // Update labels
    if (selectedPartLabel) selectedPartLabel.textContent = part.name;
    if (inspectName) inspectName.textContent = part.name;
    if (inspectLatin) inspectLatin.textContent = part.latinName || 'Terminologia Anatomica';
    if (inspectType) inspectType.textContent = part.category || part.badge || 'Anatomical Structure';
    if (inspectDescription) inspectDescription.textContent = part.detailedAnatomy || part.shortDescription || '';
    if (inspectHemodynamics) inspectHemodynamics.textContent = part.pressure || 'Standard Systemic';

    // Position & Dimensions
    if (part.pinPosition) {
      if (inspectPosition) {
        inspectPosition.textContent = `${part.pinPosition.x.toFixed(1)}, ${part.pinPosition.y.toFixed(1)}, ${part.pinPosition.z.toFixed(1)} mm`;
      }
    } else if (targetObject) {
      const wp = new THREE.Vector3();
      targetObject.getWorldPosition(wp);
      if (inspectPosition) {
        inspectPosition.textContent = `${wp.x.toFixed(2)}, ${wp.y.toFixed(2)}, ${wp.z.toFixed(2)}`;
      }
    }

    if (targetObject) {
      const box = new THREE.Box3().setFromObject(targetObject);
      const size = box.getSize(new THREE.Vector3());
      if (inspectDimensions) {
        inspectDimensions.textContent = `${(size.x * 10).toFixed(1)} × ${(size.y * 10).toFixed(1)} × ${(size.z * 10).toFixed(1)} mm`;
      }
    } else {
      if (inspectDimensions) inspectDimensions.textContent = 'Standard Adult Human Scale';
    }

    // Highlight target object if mesh
    if (targetObject && targetObject.isMesh) {
      highlightMesh(targetObject);
    }

    if (wikiBtn) wikiBtn.disabled = false;
    if (focusBtn) focusBtn.disabled = false;
  }

  function highlightMesh(mesh) {
    const originalMaterial = mesh.material;
    let highlightMaterial;

    if (originalMaterial.isMeshStandardMaterial || originalMaterial.isMeshPhysicalMaterial) {
      highlightMaterial = originalMaterial.clone();
      highlightMaterial.emissive = new THREE.Color('#39d6e7');
      highlightMaterial.emissiveIntensity = 0.55;
    } else {
      highlightMaterial = new THREE.MeshBasicMaterial({ color: '#39d6e7', wireframe: true });
    }

    mesh.material = highlightMaterial;
    highlightedMeshes.push({ mesh, originalMaterial, highlightMaterial });
  }

  function focusCurrent() {
    if (!currentPart) return;

    if (currentPart.cameraFocus) {
      const cf = currentPart.cameraFocus;
      // Convert to normalized coordinates
      cameraState.targetCameraPosition.set(cf.position.x * 0.02, cf.position.y * 0.02, cf.position.z * 0.02);
      cameraState.targetCameraTarget.set(cf.target.x * 0.02, cf.target.y * 0.02, cf.target.z * 0.02);
      cameraState.cameraTransition = true;
    } else if (currentPart.pinPosition) {
      const wp = new THREE.Vector3(currentPart.pinPosition.x * 0.016, currentPart.pinPosition.y * 0.016, currentPart.pinPosition.z * 0.016);
      focusOn(wp, 2.5);
    }
  }

  if (wikiBtn) {
    wikiBtn.addEventListener('click', () => {
      if (currentPart) onOpenWiki?.(currentPart);
    });
  }

  if (focusBtn) {
    focusBtn.addEventListener('click', focusCurrent);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearComponentSelection);
  }

  return {
    selectAnatomicalPart,
    clearComponentSelection,
    focusCurrent,
    getCurrentPart: () => currentPart
  };
}
