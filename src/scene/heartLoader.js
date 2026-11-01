
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';

const loader = new GLTFLoader();

// ========================================
// FUNCTION 1: LOAD THE ORIGINAL HEART
// ========================================

export async function loadHeartModel(scene) {
    try {
        console.log('Loading 3D heart model...');

        const gltf = await loader.loadAsync(
            '/models/heart/heart.glb'
        );

        const heart = gltf.scene;

        // Calculate heart dimensions
        const box = new Box3().setFromObject(heart);

        const size = new Vector3();
        const center = new Vector3();

        box.getSize(size);
        box.getCenter(center);

        // Center the heart
        heart.position.sub(center);

        // Normalize the heart size
        const maxDimension = Math.max(
            size.x,
            size.y,
            size.z
        );

        if (maxDimension > 0) {
            const scale = 4 / maxDimension;
            heart.scale.setScalar(scale);
        }

        // Enable shadows
        heart.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Add heart to scene
        scene.add(heart);

        console.log('Heart model loaded successfully!', heart);

        return heart;

    } catch (error) {
        console.error('Error loading heart model:', error);
        throw error;
    }
}


// ========================================
// FUNCTION 2: INSPECT NIH HEART MODELS
// ========================================

export async function inspectHeartParts() {

    const modelFiles = [
        'alm0006_a-nih3d.glb',
        'alm0006_b-nih3d.glb',
        'alm0006_c-nih3d.glb',
        'alm0006_whole-nih3d.glb'
    ];

    console.log('========== NIH HEART MODEL INSPECTION ==========');

    for (const file of modelFiles) {

        try {
            console.log(`Loading: ${file}`);

            const gltf = await loader.loadAsync(
                `/models/heart/${file}`
            );

            const model = gltf.scene;

            let meshCount = 0;
            const meshDetails = [];

            // Inspect every mesh
            model.traverse((child) => {

                if (child.isMesh) {

                    meshCount++;

                    meshDetails.push({
                        meshNumber: meshCount,
                        name: child.name || 'Unnamed',
                        geometry: child.geometry.type,
                        material: Array.isArray(child.material)
                            ? child.material.map(m => m.name || 'Unnamed')
                            : child.material?.name || 'Unnamed'
                    });

                }

            });

            // Calculate dimensions
            const box = new Box3().setFromObject(model);

            const size = new Vector3();

            box.getSize(size);

            console.log('----------------------------------');
            console.log('MODEL:', file);
            console.log('TOTAL MESHES:', meshCount);
            console.table(meshDetails);

            console.log('DIMENSIONS:', {
                x: size.x,
                y: size.y,
                z: size.z
            });

            // Release inspection model resources
            model.traverse((child) => {

                if (child.isMesh) {

                    child.geometry.dispose();

                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material?.dispose();
                    }

                }

            });

        } catch (error) {

            console.error(
                `Failed to inspect ${file}:`,
                error
            );

        }

    }

    console.log('========== INSPECTION COMPLETE ==========');
}
