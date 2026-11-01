// ============================================================================
// 3D ANATOMICAL SELECTION & RAYCASTING ENGINE
// Supports mouse clicks and hand gesture pinch-raycasting with pin hotspot detection
// ============================================================================

import * as THREE from 'three';

export function setupComponentSelection({
  renderer,
  camera,
  scene,
  onSelect
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Find anatomical part or pin at given Normalized Device Coordinate (-1 to +1)
  function pickAtNdc(x, y) {
    pointer.set(x, y);
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length === 0) return null;

    // 1. Prioritize Pin selection if close to ray
    for (const hit of intersects) {
      let cur = hit.object;
      while (cur && cur !== scene) {
        if (cur.userData && cur.userData.isPin && cur.userData.partData) {
          return {
            type: 'pin',
            partData: cur.userData.partData,
            object: cur,
            point: hit.point
          };
        }
        cur = cur.parent;
      }
    }

    // 2. Otherwise pick anatomical mesh with metadata
    for (const hit of intersects) {
      const obj = hit.object;
      if (obj.isMesh && !obj.userData.isPinRing && !obj.userData.isPinCore) {
        let partId = obj.userData.partId;
        let partName = obj.userData.partName;

        // Check parent if nested
        let cur = obj.parent;
        while (cur && cur !== scene && (!partId || !partName)) {
          if (cur.userData?.partId) partId = cur.userData.partId;
          if (cur.userData?.partName) partName = cur.userData.partName;
          cur = cur.parent;
        }

        return {
          type: 'mesh',
          partId,
          partName,
          object: obj,
          point: hit.point
        };
      }
    }

    return null;
  }

  // Handle browser mouse clicks
  function handleMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const hit = pickAtNdc(x, y);
    if (hit) {
      onSelect?.(hit);
    }
  }

  renderer.domElement.addEventListener('click', handleMouseClick);

  return {
    pickAtNdc,
    dispose() {
      renderer.domElement.removeEventListener('click', handleMouseClick);
    }
  };
}
