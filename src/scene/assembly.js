
import * as THREE from 'three';

export function createAssembly(scene) {
  const assembly = new THREE.Group();

  assembly.name = 'Mechanical Assembly';

  const parts = [];

  // Materials
  const gearMaterial = new THREE.MeshStandardMaterial({
    color: '#477f9e',
    metalness: 0.75,
    roughness: 0.3
  });

  const shaftMaterial = new THREE.MeshStandardMaterial({
    color: '#aebbc4',
    metalness: 0.85,
    roughness: 0.25
  });

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: '#263b4a',
    metalness: 0.65,
    roughness: 0.4
  });

  const hubMaterial = new THREE.MeshStandardMaterial({
    color: '#d4a94d',
    metalness: 0.8,
    roughness: 0.25
  });

  // Helper function to create and register components.
  function addPart(mesh, componentName) {
    mesh.userData.selectableName = componentName;
    mesh.userData.partName = componentName;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    assembly.add(mesh);

    parts.push({
      mesh,
      originalPosition: mesh.position.clone()
    });

    return mesh;
  }

  // Create a gear with teeth.
  function createGear(name, radius, yPosition, toothCount) {
    const thickness = 0.22;

    // Main circular gear body.
    const gearGeometry = new THREE.CylinderGeometry(
      radius,
      radius,
      thickness,
      48
    );

    const gearBody = new THREE.Mesh(
      gearGeometry,
      gearMaterial
    );

    gearBody.position.set(0, yPosition, 0);

    addPart(gearBody, name);

    // Gear teeth.
    const toothWidth = (2 * Math.PI * radius) /
      toothCount * 0.65;

    const toothGeometry = new THREE.BoxGeometry(
      toothWidth,
      thickness,
      0.18
    );

    for (let i = 0; i < toothCount; i++) {
      const angle = (i / toothCount) * Math.PI * 2;

      const tooth = new THREE.Mesh(
        toothGeometry,
        gearMaterial
      );

      tooth.position.set(
        Math.cos(angle) * (radius + 0.07),
        yPosition,
        Math.sin(angle) * (radius + 0.07)
      );

      tooth.rotation.y = -angle;

      addPart(tooth, name);
    }
  }

  // Central vertical shaft.
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.22,
      0.22,
      3.3,
      32
    ),
    shaftMaterial
  );

  shaft.position.set(0, 0, 0);

  addPart(shaft, 'Central Shaft');

  // Three gears at different heights.
  createGear('Upper Gear', 1.0, 1.05, 12);
  createGear('Middle Gear', 0.75, 0, 10);
  createGear('Lower Gear', 0.55, -1.05, 8);

  // Base plate.
  const basePlate = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.25, 3.4),
    baseMaterial
  );

  basePlate.position.set(0, -1.85, 0);

  addPart(basePlate, 'Base Plate');

  // Central hub.
  const centralHub = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.38,
      0.38,
      0.35,
      32
    ),
    hubMaterial
  );

  centralHub.position.set(0, 1.75, 0);

  addPart(centralHub, 'Central Hub');

  // Add the complete assembly to the scene.
  scene.add(assembly);

  return {
    assembly,
    parts
  };
}
