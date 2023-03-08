// =========== Imports ===========
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import BuildRoom from './room';
import BuidlBox from './box';
import BuildBall from './ball';
import AddLight from './lights';

// ============  GUI Initialization  ============
// Options menu to tweak the display
const GUI = new dat.GUI({ title: 'Options' });
// closed by default
GUI.close();
/** parameters To hold UI options */
const params = {
  /** Cage material */
  material: 'Iron',
  /** Cage style */
  cage: 'als',
  /** Ball style */
  matcap: '3',
  /** Light type */
  light: 'directional',
  /** Light color */
  color: 0xffffff,
  /** Light position Y */
  lightY: 20,
  /** Light position X */
  lightX: 20,
  /** Light position Z */
  lightZ: 20,
};

// ============  Dom elements  ============
/** spinner div. used to hide/show spinner */
const spinner = document.querySelector('.spinner');

/** canvas to render the scene within */
const canvas = document.querySelector('canvas.webgl');

// ============  Textures  ============
/** Loading manager. used to listen on loading events */
const loadingManager = new THREE.LoadingManager();

// Hide spinner after texture loaded
loadingManager.onLoad = () => {
  spinner.style.display = 'none';
};

/** Texture loader. used to load textures */
const textureLoader = new THREE.TextureLoader(loadingManager);

/** sky image to use as scene background */
const skyTexture = textureLoader.load('/textures/ALS-sky.jpg');

/** Scene */
const scene = new THREE.Scene();
// Set scene background
scene.background = skyTexture;

// ============  Lights  ============
AddLight(scene, GUI, params);
// ============  Objects  ============
// ***** Cage *****
BuidlBox(scene, textureLoader, GUI, params);

// ***** Ball *****
const sphere = BuildBall(scene, textureLoader, GUI, params);

// ============  Room  ============
BuildRoom(scene, textureLoader);

// ============  Sizes  ============
/** Canvas sizes */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// resize canvas on window risizing
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============  Camera  ============
/** Base camera */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// Positioning the Camera
camera.position.set(1, 1, 10);

// Add Camera to the scene.
scene.add(camera);

// ============  Controls  ============
/** Camera controller */
const controls = new OrbitControls(camera, canvas);
// add Damping effect
controls.enableDamping = true;
// Stop looking under the floor.
controls.maxPolarAngle = Math.PI / 2;
// Max zoom out.
controls.maxDistance = 15;
// Max zoom in.
controls.minDistance = 3;
// Stop right click
controls.enablePan = false;

// ============  Renderer  ============
/** Renderer */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// Set renderer size
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Enable Shadows.
renderer.shadowMap.enabled = true;

// ============  Animating  ============

/** Clook to update animation */
const clock = new THREE.Clock();

/** Draw frames */
const tick = () => {
  // Get the seconds passed since the clock started.
  const elapsedTime = clock.getElapsedTime();

  /** Move the Ball */
  sphere.position.y = Math.sin(8 * elapsedTime);
  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.z = Math.cos(elapsedTime * 0.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
// Start
tick();
