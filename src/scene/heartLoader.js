// ============================================================================
// HEART MODEL LOADER & DISSECTION ENGINE
// Authentic NIH 3D Print Exchange GLTF models with dissection vectors & 3D pins
// ============================================================================

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { HEART_ANATOMY } from '../data/heartAnatomy.js';

const loader = new GLTFLoader();

// Standard bounding center and scale factor for NIH models
const NIH_CENTER = new THREE.Vector3(16.76, -119.96, -1.09);
const NIH_SCALE = 2.4 / 145.0; // Normalizes model to ~2.4 scene units

export async function loadCardiacModelSuite(scene) {
  const masterHeartGroup = new THREE.Group();
  masterHeartGroup.name = 'Cardiac Model Suite';

  // Containers for whole model and dissected sectional parts
  const wholeGroup = new THREE.Group();
  wholeGroup.name = 'NIH Whole Heart';

  const dissectedGroup = new THREE.Group();
  dissectedGroup.name = 'NIH Dissected Sections (A, B, C)';

  // 1. Load Whole Model
  try {
    const wholeGltf = await loader.loadAsync('/models/heart/alm0006_whole-nih3d.glb');
    const wholeMesh = wholeGltf.scene;

    wholeMesh.position.sub(NIH_CENTER);
    wholeMesh.scale.setScalar(NIH_SCALE);

    applyMedicalMaterial(wholeMesh, 'myocardium');
    wholeMesh.userData = { partId: 'left-ventricle', partName: 'Human Heart (Whole)' };

    wholeGroup.add(wholeMesh);
  } catch (err) {
    console.warn('Could not load alm0006_whole-nih3d.glb, falling back to heart.glb:', err);
    try {
      const fallback = await loader.loadAsync('/models/heart/heart.glb');
      const mesh = fallback.scene;
      normalizeGenericModel(mesh, 2.5);
      applyMedicalMaterial(mesh, 'myocardium');
      wholeGroup.add(mesh);
    } catch (e) {
      console.error('Failed to load fallback heart:', e);
    }
  }

  // 2. Load Dissected Sections A, B, C
  const sectionFiles = [
    { file: 'alm0006_a-nih3d.glb', id: 'part-a', name: 'Section A: Great Vessels & Atria', vec: new THREE.Vector3(0, 1.2, 0.4), color: '#a0485c' },
    { file: 'alm0006_b-nih3d.glb', id: 'part-b', name: 'Section B: Valvular Plane & Mid-Heart', vec: new THREE.Vector3(-1.4, 0, 0.3), color: '#8f3c4c' },
    { file: 'alm0006_c-nih3d.glb', id: 'part-c', name: 'Section C: Ventricles & Apical Myocardium', vec: new THREE.Vector3(0.6, -1.3, -0.3), color: '#7b2e3e' }
  ];

  const dissectibleParts = [];

  for (const item of sectionFiles) {
    try {
      const gltf = await loader.loadAsync(`/models/heart/${item.file}`);
      const partScene = gltf.scene;

      partScene.position.sub(NIH_CENTER);
      partScene.scale.setScalar(NIH_SCALE);

      applyMedicalMaterial(partScene, 'sectional', item.color);
      partScene.userData = {
        isDissectiblePart: true,
        partCode: item.id,
        partName: item.name,
        originalPosition: partScene.position.clone(),
        explodeVector: item.vec.clone()
      };

      dissectibleParts.push({
        object: partScene,
        originalPosition: partScene.position.clone(),
        explodeVector: item.vec.clone()
      });

      dissectedGroup.add(partScene);
    } catch (e) {
      console.warn(`Could not load section ${item.file}:`, e);
    }
  }

  // By default, show dissected group (fits together seamlessly at distance 0, separates in dissection view)
  if (dissectedGroup.children.length > 0) {
    wholeGroup.visible = false;
    masterHeartGroup.add(dissectedGroup);
    masterHeartGroup.add(wholeGroup);
  } else {
    wholeGroup.visible = true;
    masterHeartGroup.add(wholeGroup);
  }

  // 3. Create 3D Landmark Hotspot Pins
  const pinsGroup = new THREE.Group();
  pinsGroup.name = 'Anatomical Pins';

  const pins = createAnatomicalPins(HEART_ANATOMY);
  pins.forEach(pin => pinsGroup.add(pin));
  masterHeartGroup.add(pinsGroup);

  scene.add(masterHeartGroup);

  return {
    group: masterHeartGroup,
    wholeGroup,
    dissectedGroup,
    dissectibleParts,
    pinsGroup,
    pins
  };
}

// ----------------------------------------------------------------------------
// MEDICAL MATERIAL CREATION
// ----------------------------------------------------------------------------
function applyMedicalMaterial(object, type = 'myocardium', customColor = null) {
  object.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      const mat = new THREE.MeshStandardMaterial({
        color: customColor || '#8a3344',
        roughness: 0.38,
        metalness: 0.12,
        bumpScale: 0.05
      });

      child.userData.standardMaterial = mat;
      child.material = mat;
    }
  });
}

export function setHeartXRayMode(object, enabled) {
  if (!object) return;
  object.traverse(child => {
    if (child.isMesh && !child.userData.isPin) {
      if (enabled) {
        if (!child.userData.xrayMaterial) {
          child.userData.xrayMaterial = new THREE.MeshPhysicalMaterial({
            color: '#39d6e7',
            transparent: true,
            opacity: 0.35,
            roughness: 0.1,
            metalness: 0.8,
            transmission: 0.6,
            wireframe: false
          });
        }
        child.material = child.userData.xrayMaterial;
      } else {
        if (child.userData.standardMaterial) {
          child.material = child.userData.standardMaterial;
        }
      }
    }
  });
}

// ----------------------------------------------------------------------------
// 3D ANATOMICAL LANDMARK PINS
// ----------------------------------------------------------------------------
function createAnatomicalPins(anatomyData) {
  const pins = [];

  anatomyData.forEach(item => {
    if (!item.pinPosition) return;

    const pinGroup = new THREE.Group();
    pinGroup.name = `Pin_${item.id}`;
    pinGroup.userData = {
      isPin: true,
      partId: item.id,
      partData: item
    };

    // Transform pin position using NIH center and scale
    const worldPos = new THREE.Vector3(item.pinPosition.x, item.pinPosition.y, item.pinPosition.z)
      .sub(NIH_CENTER)
      .multiplyScalar(NIH_SCALE);

    pinGroup.position.copy(worldPos);

    // Glowing core sphere
    const sphereGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: '#39d6e7',
      transparent: true,
      opacity: 0.95
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.userData = { isPinCore: true, partId: item.id, partData: item };
    pinGroup.add(sphere);

    // Outer pulsing ring
    const ringGeo = new THREE.RingGeometry(0.065, 0.085, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#39e58c',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { isPinRing: true };
    pinGroup.add(ring);

    // Thin marker needle
    const needleGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8);
    const needleMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const needle = new THREE.Mesh(needleGeo, needleMat);
    needle.position.y = -0.07;
    pinGroup.add(needle);

    pins.push(pinGroup);
  });

  return pins;
}

// ----------------------------------------------------------------------------
// NORMALIZE GENERIC MODEL
// ----------------------------------------------------------------------------
function normalizeGenericModel(model, targetSize = 2.5) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    model.scale.setScalar(targetSize / maxDim);
  }
}
