
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadGlbOrgan(modelPath, organName) {
  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        const organ = gltf.scene;
        organ.name = organName;

        // Enable shadows without replacing original materials.
        organ.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Preserve existing GLB anatomical metadata.
            if (!child.userData.partId) {
              child.userData.partId =
                child.name || organName.toLowerCase();
            }

            if (!child.userData.partName) {
              child.userData.partName =
                child.name || organName;
            }
          }
        });

        // Calculate model dimensions.
        const box = new THREE.Box3().setFromObject(organ);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centre the model.
        organ.position.sub(center);

        // Normalize the model size.
        const maxDimension = Math.max(
          size.x,
          size.y,
          size.z
        );

        if (maxDimension > 0) {
          const scale = 2.2 / maxDimension;
          organ.scale.multiplyScalar(scale);
        }

        console.log(`${organName} loaded successfully`);

        resolve(organ);
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${organName}:`, error);
        reject(error);
      }
    );
  });
}
