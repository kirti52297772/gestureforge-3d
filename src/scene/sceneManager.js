// ============================================================================
// THREE.JS MEDICAL 3D SCENE MANAGER
// Studio surgical lighting, PBR tonemapping, OrbitControls, and clinical tools
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createSceneManager() {
  const viewer = document.querySelector('#viewer');

  if (!viewer) {
    throw new Error('3D viewer element #viewer was not found.');
  }

  // Create the 3D scene.
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#091016');

  // Create the camera.
  const camera = new THREE.PerspectiveCamera(
    42,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
  );

  const defaultCameraPosition = new THREE.Vector3(0, 0.4, 4.2);
  const defaultCameraTarget = new THREE.Vector3(0, 0, 0);

  camera.position.copy(defaultCameraPosition);

  // Create the WebGL renderer.
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(Math.max(viewer.clientWidth, 1), Math.max(viewer.clientHeight, 1));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  viewer.appendChild(renderer.domElement);

  // --------------------------------------------------------------------------
  // SURGICAL WORKSTATION LIGHTING
  // --------------------------------------------------------------------------
  // 1. Soft surgical ambient light
  const ambientLight = new THREE.AmbientLight('#e6f3fa', 1.4);
  scene.add(ambientLight);

  // 2. Overhead surgical exam key light
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // 3. Cool cyan fill light (clinical diagnostic tone)
  const fillLight = new THREE.DirectionalLight('#39d6e7', 1.0);
  fillLight.position.set(-5, 2, -3);
  scene.add(fillLight);

  // 4. Subtle rim light to highlight anatomical contours
  const rimLight = new THREE.DirectionalLight('#ffffff', 1.2);
  rimLight.position.set(0, -5, -4);
  scene.add(rimLight);

  // --------------------------------------------------------------------------
  // CLINICAL REFERENCE GRID
  // --------------------------------------------------------------------------
  const gridHelper = new THREE.GridHelper(10, 20, '#264b63', '#162836');
  gridHelper.position.y = -2.2;
  scene.add(gridHelper);

  // --------------------------------------------------------------------------
  // ORBIT CONTROLS
  // --------------------------------------------------------------------------
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.minDistance = 1.0;
  controls.maxDistance = 15;
  controls.target.copy(defaultCameraTarget);
  controls.update();

  // Camera transition state
  const cameraState = {
    defaultCameraPosition,
    defaultCameraTarget,
    targetCameraPosition: defaultCameraPosition.clone(),
    targetCameraTarget: defaultCameraTarget.clone(),
    cameraTransition: false
  };

  function focusOn(targetPosition, distance = 3.2) {
    cameraState.targetCameraTarget.copy(targetPosition);

    const dir = camera.position.clone().sub(controls.target).normalize();
    if (dir.lengthSq() < 0.001) dir.set(0, 0.2, 1).normalize();

    cameraState.targetCameraPosition.copy(targetPosition).add(dir.multiplyScalar(distance));
    cameraState.cameraTransition = true;
  }

  function resetCamera() {
    cameraState.targetCameraPosition.copy(defaultCameraPosition);
    cameraState.targetCameraTarget.copy(defaultCameraTarget);
    cameraState.cameraTransition = true;
  }

  return {
    viewer,
    scene,
    camera,
    renderer,
    controls,
    cameraState,
    focusOn,
    resetCamera
  };
}
