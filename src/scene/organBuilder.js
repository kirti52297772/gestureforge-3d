// ============================================================================
// 3D PROCEDURAL ORGAN BUILDER
// High-fidelity procedural anatomical models for Brain, Lungs, Kidney, and Eye
// ============================================================================

import * as THREE from 'three';

export function createOrganModel(organId) {
  switch (organId) {
    case 'brain':
      return buildBrainModel();
    case 'lungs':
      return buildLungsModel();
    case 'kidney':
      return buildKidneyModel();
    case 'eye':
      return buildEyeModel();
    default:
      return null;
  }
}

// ----------------------------------------------------------------------------
// 1. BRAIN MODEL (Cerebrum, Frontal, Temporal, Cerebellum, Brainstem)
// ----------------------------------------------------------------------------
function buildBrainModel() {
  const group = new THREE.Group();
  group.name = 'Human Brain';

  // Frontal Lobe (Anterior superior cerebrum)
  const frontalGeo = new THREE.SphereGeometry(2.2, 32, 24);
  frontalGeo.scale(1.2, 0.9, 1.3);
  const frontalMat = new THREE.MeshStandardMaterial({
    color: '#e28d9a',
    roughness: 0.45,
    metalness: 0.1,
    bumpScale: 0.05
  });
  const frontalLeft = new THREE.Mesh(frontalGeo, frontalMat);
  frontalLeft.position.set(-1.1, 0.8, 1.0);
  frontalLeft.userData = { partId: 'frontal-lobe', partName: 'Frontal Lobe (Left)', explodeDir: new THREE.Vector3(-0.6, 0.5, 0.8) };
  group.add(frontalLeft);

  const frontalRight = new THREE.Mesh(frontalGeo, frontalMat);
  frontalRight.position.set(1.1, 0.8, 1.0);
  frontalRight.userData = { partId: 'frontal-lobe', partName: 'Frontal Lobe (Right)', explodeDir: new THREE.Vector3(0.6, 0.5, 0.8) };
  group.add(frontalRight);

  // Temporal Lobe & Parieto-Occipital
  const temporalGeo = new THREE.SphereGeometry(1.8, 32, 24);
  temporalGeo.scale(1.1, 0.85, 1.2);
  const temporalMat = new THREE.MeshStandardMaterial({
    color: '#c97fa7',
    roughness: 0.45,
    metalness: 0.1
  });
  const temporalLeft = new THREE.Mesh(temporalGeo, temporalMat);
  temporalLeft.position.set(-1.6, -0.2, 0.2);
  temporalLeft.userData = { partId: 'temporal-lobe', partName: 'Temporal Lobe (Left)', explodeDir: new THREE.Vector3(-1.2, 0, 0.2) };
  group.add(temporalLeft);

  const temporalRight = new THREE.Mesh(temporalGeo, temporalMat);
  temporalRight.position.set(1.6, -0.2, 0.2);
  temporalRight.userData = { partId: 'temporal-lobe', partName: 'Temporal Lobe (Right)', explodeDir: new THREE.Vector3(1.2, 0, 0.2) };
  group.add(temporalRight);

  // Cerebellum (Posterior-inferior)
  const cerebGeo = new THREE.SphereGeometry(1.5, 32, 24);
  cerebGeo.scale(1.5, 0.8, 1.0);
  const cerebMat = new THREE.MeshStandardMaterial({
    color: '#b56d85',
    roughness: 0.5,
    metalness: 0.15
  });
  const cereb = new THREE.Mesh(cerebGeo, cerebMat);
  cereb.position.set(0, -1.2, -1.5);
  cereb.userData = { partId: 'cerebellum', partName: 'Cerebellum', explodeDir: new THREE.Vector3(0, -0.8, -1.2) };
  group.add(cereb);

  // Brainstem (Midbrain, Pons, Medulla)
  const stemGeo = new THREE.CylinderGeometry(0.55, 0.45, 3.2, 24);
  const stemMat = new THREE.MeshStandardMaterial({
    color: '#f0c6b9',
    roughness: 0.35,
    metalness: 0.05
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, -1.8, -0.4);
  stem.rotation.x = 0.2;
  stem.userData = { partId: 'brainstem', partName: 'Brainstem', explodeDir: new THREE.Vector3(0, -1.2, 0) };
  group.add(stem);

  group.scale.setScalar(0.9);
  return group;
}

// ----------------------------------------------------------------------------
// 2. LUNGS MODEL (Trachea, Bronchi, Right Lung with 3 lobes, Left Lung with 2 lobes)
// ----------------------------------------------------------------------------
function buildLungsModel() {
  const group = new THREE.Group();
  group.name = 'Human Lungs';

  // Trachea & Main Bronchi
  const airwayMat = new THREE.MeshStandardMaterial({
    color: '#39d6e7',
    roughness: 0.3,
    metalness: 0.2
  });
  const tracheaGeo = new THREE.CylinderGeometry(0.38, 0.38, 3.5, 24);
  const trachea = new THREE.Mesh(tracheaGeo, airwayMat);
  trachea.position.set(0, 2.5, 0);
  trachea.userData = { partId: 'trachea-bronchi', partName: 'Trachea', explodeDir: new THREE.Vector3(0, 1.0, 0) };
  group.add(trachea);

  // Right Bronchus
  const rightBronchusGeo = new THREE.CylinderGeometry(0.28, 0.24, 1.6, 20);
  const rightBronchus = new THREE.Mesh(rightBronchusGeo, airwayMat);
  rightBronchus.position.set(0.65, 0.6, 0);
  rightBronchus.rotation.z = -0.55;
  rightBronchus.userData = { partId: 'trachea-bronchi', partName: 'Right Main Bronchus', explodeDir: new THREE.Vector3(0.5, 0.4, 0) };
  group.add(rightBronchus);

  // Left Bronchus
  const leftBronchusGeo = new THREE.CylinderGeometry(0.25, 0.22, 2.0, 20);
  const leftBronchus = new THREE.Mesh(leftBronchusGeo, airwayMat);
  leftBronchus.position.set(-0.85, 0.5, 0);
  leftBronchus.rotation.z = 0.85;
  leftBronchus.userData = { partId: 'trachea-bronchi', partName: 'Left Main Bronchus', explodeDir: new THREE.Vector3(-0.5, 0.4, 0) };
  group.add(leftBronchus);

  // Right Lung (Superior, Middle, Inferior Lobes)
  const lungMat = new THREE.MeshStandardMaterial({
    color: '#e07a7a',
    roughness: 0.5,
    metalness: 0.05
  });

  const rightLungGeo = new THREE.ConeGeometry(2.1, 5.2, 28);
  rightLungGeo.scale(1.0, 1.0, 0.85);
  const rightLung = new THREE.Mesh(rightLungGeo, lungMat);
  rightLung.position.set(2.2, -0.2, 0);
  rightLung.rotation.z = 0.08;
  rightLung.userData = { partId: 'right-lung', partName: 'Right Lung (3 Lobes)', explodeDir: new THREE.Vector3(1.2, 0, 0) };
  group.add(rightLung);

  // Left Lung with Cardiac Notch
  const leftLungGeo = new THREE.ConeGeometry(1.85, 4.9, 28);
  leftLungGeo.scale(0.9, 1.0, 0.8);
  const leftLung = new THREE.Mesh(leftLungGeo, lungMat);
  leftLung.position.set(-2.0, -0.3, 0);
  leftLung.rotation.z = -0.08;
  leftLung.userData = { partId: 'left-lung', partName: 'Left Lung & Cardiac Notch', explodeDir: new THREE.Vector3(-1.2, 0, 0) };
  group.add(leftLung);

  group.scale.setScalar(0.75);
  return group;
}

// ----------------------------------------------------------------------------
// 3. KIDNEY MODEL (Cortex, Medulla, Renal Pelvis, Renal Artery & Vein, Ureter)
// ----------------------------------------------------------------------------
function buildKidneyModel() {
  const group = new THREE.Group();
  group.name = 'Human Kidney';

  // Renal Cortex (Outer bean shape)
  const cortexGeo = new THREE.SphereGeometry(2.4, 32, 24);
  cortexGeo.scale(0.9, 1.6, 0.95);
  const cortexMat = new THREE.MeshStandardMaterial({
    color: '#9e3d3d',
    roughness: 0.35,
    metalness: 0.15
  });
  const cortex = new THREE.Mesh(cortexGeo, cortexMat);
  cortex.position.set(0, 0, 0);
  cortex.userData = { partId: 'renal-cortex', partName: 'Renal Cortex', explodeDir: new THREE.Vector3(0.8, 0, 0) };
  group.add(cortex);

  // Renal Medulla (Pyramids inside)
  const medullaGeo = new THREE.ConeGeometry(0.7, 1.2, 16);
  const medullaMat = new THREE.MeshStandardMaterial({
    color: '#701c1c',
    roughness: 0.4
  });
  for (let i = -2; i <= 2; i++) {
    const pyramid = new THREE.Mesh(medullaGeo, medullaMat);
    pyramid.position.set(-0.3, i * 0.7, 0);
    pyramid.rotation.z = Math.PI / 2 + (i * 0.15);
    pyramid.scale.setScalar(0.7);
    pyramid.userData = { partId: 'renal-medulla', partName: `Renal Pyramid ${i + 3}`, explodeDir: new THREE.Vector3(-0.6, i * 0.3, 0) };
    group.add(pyramid);
  }

  // Renal Artery (Red) & Renal Vein (Blue)
  const arteryMat = new THREE.MeshStandardMaterial({ color: '#ff334b', roughness: 0.3 });
  const arteryGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.0, 16);
  const artery = new THREE.Mesh(arteryGeo, arteryMat);
  artery.position.set(-1.8, 0.4, 0.2);
  artery.rotation.z = Math.PI / 2.2;
  artery.userData = { partId: 'renal-cortex', partName: 'Renal Artery', explodeDir: new THREE.Vector3(-1.0, 0.2, 0.2) };
  group.add(artery);

  const veinMat = new THREE.MeshStandardMaterial({ color: '#267bd6', roughness: 0.3 });
  const veinGeo = new THREE.CylinderGeometry(0.26, 0.26, 2.0, 16);
  const vein = new THREE.Mesh(veinGeo, veinMat);
  vein.position.set(-1.8, -0.1, -0.2);
  vein.rotation.z = Math.PI / 2.1;
  vein.userData = { partId: 'renal-cortex', partName: 'Renal Vein', explodeDir: new THREE.Vector3(-1.0, -0.2, -0.2) };
  group.add(vein);

  // Ureter
  const ureterMat = new THREE.MeshStandardMaterial({ color: '#f5d77f', roughness: 0.35 });
  const ureterGeo = new THREE.CylinderGeometry(0.18, 0.15, 3.2, 16);
  const ureter = new THREE.Mesh(ureterGeo, ureterMat);
  ureter.position.set(-1.4, -2.2, 0);
  ureter.rotation.z = 0.25;
  ureter.userData = { partId: 'renal-medulla', partName: 'Ureter', explodeDir: new THREE.Vector3(-0.5, -1.0, 0) };
  group.add(ureter);

  group.scale.setScalar(0.9);
  return group;
}

// ----------------------------------------------------------------------------
// 4. EYE MODEL (Cornea, Sclera, Iris, Pupil, Crystalline Lens, Retina, Optic Nerve)
// ----------------------------------------------------------------------------
function buildEyeModel() {
  const group = new THREE.Group();
  group.name = 'Human Eye';

  // Sclera (White outer globe)
  const scleraGeo = new THREE.SphereGeometry(2.5, 36, 32);
  const scleraMat = new THREE.MeshStandardMaterial({
    color: '#f4f7f6',
    roughness: 0.25,
    metalness: 0.05
  });
  const sclera = new THREE.Mesh(scleraGeo, scleraMat);
  sclera.position.set(0, 0, 0);
  sclera.userData = { partId: 'cornea-lens', partName: 'Sclera', explodeDir: new THREE.Vector3(0, 0, -0.5) };
  group.add(sclera);

  // Cornea (Transparent anterior dome)
  const corneaGeo = new THREE.SphereGeometry(1.2, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2.2);
  const corneaMat = new THREE.MeshPhysicalMaterial({
    color: '#aae9ff',
    transparent: true,
    opacity: 0.45,
    roughness: 0.05,
    transmission: 0.7,
    ior: 1.376
  });
  const cornea = new THREE.Mesh(corneaGeo, corneaMat);
  cornea.position.set(0, 0, 2.1);
  cornea.userData = { partId: 'cornea-lens', partName: 'Cornea', explodeDir: new THREE.Vector3(0, 0, 1.2) };
  group.add(cornea);

  // Iris (Colored ring)
  const irisGeo = new THREE.RingGeometry(0.35, 1.15, 32);
  const irisMat = new THREE.MeshStandardMaterial({
    color: '#2a7ebb',
    roughness: 0.3,
    side: THREE.DoubleSide
  });
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.position.set(0, 0, 2.15);
  iris.userData = { partId: 'cornea-lens', partName: 'Iris & Pupil', explodeDir: new THREE.Vector3(0, 0, 0.9) };
  group.add(iris);

  // Crystalline Lens
  const lensGeo = new THREE.SphereGeometry(0.7, 32, 20);
  lensGeo.scale(1.0, 1.0, 0.45);
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.65,
    roughness: 0.1,
    transmission: 0.85
  });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.set(0, 0, 1.7);
  lens.userData = { partId: 'cornea-lens', partName: 'Crystalline Lens', explodeDir: new THREE.Vector3(0, 0, 0.6) };
  group.add(lens);

  // Optic Nerve (Posterior trunk)
  const nerveGeo = new THREE.CylinderGeometry(0.38, 0.42, 2.5, 20);
  const nerveMat = new THREE.MeshStandardMaterial({
    color: '#ecd6c0',
    roughness: 0.45
  });
  const nerve = new THREE.Mesh(nerveGeo, nerveMat);
  nerve.position.set(0, 0, -3.2);
  nerve.rotation.x = Math.PI / 2;
  nerve.userData = { partId: 'retina-macula', partName: 'Optic Nerve (CN II)', explodeDir: new THREE.Vector3(0, 0, -1.2) };
  group.add(nerve);

  group.scale.setScalar(0.9);
  return group;
}
