
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createSceneManager() {
  const viewer = document.querySelector('#viewer');

  if (!viewer) {
    throw new Error('3D viewer element #viewer was not found.');
  }

  // Create the 3D scene.
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#101820');

  // Create the camera.
  const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    1000
  );

  const defaultCameraPosition = new THREE.Vector3(5, 4, 8);
  const defaultCameraTarget = new THREE.Vector3(0, 0, 0);

  camera.position.copy(defaultCameraPosition);

  // Create the WebGL renderer.
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(
    Math.max(viewer.clientWidth, 1),
    Math.max(viewer.clientHeight, 1)
  );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  viewer.appendChild(renderer.domElement);

  // Add ambient lighting.
  const ambientLight = new THREE.AmbientLight(
    '#ffffff',
    1.5
  );

  scene.add(ambientLight);

  // Add directional lighting.
  const directionalLight = new THREE.DirectionalLight(
    '#ffffff',
    2.5
  );

  directionalLight.position.set(5, 8, 6);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.set(2048, 2048);

  scene.add(directionalLight);

  // Add a secondary light for better visibility.
  const fillLight = new THREE.DirectionalLight(
    '#39d6e7',
    0.8
  );

  fillLight.position.set(-5, 3, -4);

  scene.add(fillLight);

  // Configure mouse-based camera controls.
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;

  controls.minDistance = 3;
  controls.maxDistance = 18;

  controls.target.copy(defaultCameraTarget);
  controls.update();

  // Camera transition state used by the inspector.
  const cameraState = {
    defaultCameraPosition,
    defaultCameraTarget,

    targetCameraPosition: defaultCameraPosition.clone(),
    targetCameraTarget: defaultCameraTarget.clone(),

    cameraTransition: false
  };

  return {
    viewer,
    scene,
    camera,
    renderer,
    controls,
    cameraState
  };
}
