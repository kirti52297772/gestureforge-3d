
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';

const loader = new GLTFLoader();

export async function loadHeartModel(scene) {
    try {
        console.log('Loading 3D heart model...');

        // Load the GLB file
        const gltf = await loader.loadAsync('/models/heart/heart.glb');

        const heart = gltf.scene;

        // Calculate the model's dimensions
        const box = new Box3().setFromObject(heart);
        const size = new Vector3();
        const center = new Vector3();

        box.getSize(size);
        box.getCenter(center);

        // Move the model's origin to its centre
        heart.position.sub(center);

        // Normalize model size for the 3D viewer
        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
            const scale = 4 / maxDimension;
            heart.scale.setScalar(scale);
        }

        // Enable shadows and improve mesh rendering
        heart.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Add heart to the existing Three.js scene
        scene.add(heart);

        console.log('Heart model loaded successfully!', heart);

        return heart;

    } catch (error) {
        console.error('Error loading heart model:', error);
        throw error;
    }
}
