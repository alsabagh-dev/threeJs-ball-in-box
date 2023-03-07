import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * GUI
 */
const GUI = new dat.GUI({ title: 'Options' });
// close by default
GUI.close();
// To hold UI options
const params = {
  material: 'Iron',
  cage: 'als',
  matcap: '3',
  light: 'directional',
  color: 0xffffff,
  lightY: 20,
  lightX: 20,
  lightZ: 20,
};

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

const spinner = document.querySelector('.spinner');

loadingManager.onLoad = () => {
  spinner.style.display = 'none'; 
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const MaterialTextures = {
  wood: textureLoader.load('/textures/ALS-wood.png'),
  iron: textureLoader.load('/textures/ALS-iron.png'),
  bricks: textureLoader.load('/textures/ALS-brick.png'),
};

let materialTexture = MaterialTextures.iron;

GUI.add(params, 'material', ['Wood', 'Iron', 'Bricks'])
  .name('Material')
  .onChange((event) => {
    materialTexture = MaterialTextures[event.toLowerCase()];
  });

const CageStyles = {
  als: textureLoader.load('/textures/ALS-alpha.png'),
  wire: textureLoader.load('/textures/wire-alpha.png'),
  wire2: textureLoader.load('/textures/wire2-alpha.png'),
  cross: textureLoader.load('/textures/cross-alpha.png'),
  bars: textureLoader.load('/textures/bars-alpha.png'),
};

let alphaTexture = CageStyles.als;
GUI.add(params, 'cage', ['ALS', 'Wire', 'Wire2', 'Cross', 'bars'])
  .name('Cage Style')
  .onChange((event) => {
    alphaTexture = CageStyles[event.toLowerCase()];
  });

const matcaps = [
  textureLoader.load('/textures/matcaps/1.png'),
  textureLoader.load('/textures/matcaps/2.png'),
  textureLoader.load('/textures/matcaps/3.png'),
  textureLoader.load('/textures/matcaps/4.png'),
  textureLoader.load('/textures/matcaps/5.png'),
  textureLoader.load('/textures/matcaps/6.png'),
  textureLoader.load('/textures/matcaps/7.png'),
  textureLoader.load('/textures/matcaps/8.png'),
]
let matcapTexture = matcaps[2];
GUI.add(params, 'matcap', ['1', '2', '3', '4', '5', '6', '7', '8'])
  .name('Ball Style')
  .onChange((event) => {
    matcapTexture = matcaps[+event - 1];
  });
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const skyTexture = textureLoader.load('/textures/ALS-sky.png');

scene.background = skyTexture;

// Light
const backLight = new THREE.AmbientLight(0xffffff, 0.3);

const Lights = {
  directional: new THREE.DirectionalLight( 0xFFFFFF ),
  hemisphere: new THREE.HemisphereLight( 0xffffff, 0x0000FF, 1 ),
  point: new THREE.PointLight( 0xFFFFFF, 1, 100 ),
}

let light = Lights.directional;
light.name = 'light';
light.castShadow =true;


GUI.add(params, 'light', ['directional', 'hemisphere', 'point'])
  .name('Ball Style')
  .onChange((event) => {

    scene.remove(scene.getObjectByName('light'))
    light = Lights[event.toLowerCase()];
    light.name = 'light';
    event !== 'hemisphere' && (light.castShadow= true);
    light.position.set(5,5,5);
    light.color = new THREE.Color(params.color)
    scene.add(light);
    
  });

GUI.addColor(params, 'color')
  .name('Light color')
  .onChange((event) => {
    light.color = new THREE.Color(event)
  });

light.position.set(5,5,5);

scene.add(backLight, light);

(() => {
  const GUILightPosition = GUI.addFolder('Light Position');
  GUILightPosition.add(light.position, 'x').max(10).min(-10).step(0.1).name('X').onChange((e) => {light.position.set(e,params.lightY ,params.lightZ)});
  GUILightPosition.add(light.position, 'y').max(15).min(1.5).step(0.1).name('Y').onChange((e) => {light.position.set(params.lightX, e,params.lightZ)});
  GUILightPosition.add(light.position, 'z').max(10).min(0.0).step(0.1).name('Z').onChange((e) => {light.position.set(params.lightX, params.lightY ,e)});
}  
)();


/**
 * Object
 */
// Cage
const boxGeometry = new THREE.BoxBufferGeometry(3, 3, 3);
const boxMaterial = new THREE.MeshStandardMaterial({ map: materialTexture });

boxMaterial.side = THREE.DoubleSide;
boxMaterial.alphaMap = alphaTexture;
boxMaterial.alphaTest = 0.5;
boxMaterial.transparent = true;

const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;
scene.add(box);

// Sphere
const sphereMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64),
  sphereMaterial
);

sphere.castShadow = true;

scene.add(sphere);

// ground
const groundTexture = textureLoader.load('textures/ALS-ground.png');
const groundMaterial = new THREE.MeshStandardMaterial({map: groundTexture, color: 0xfaf0e6});

const ground = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30, 30),
  groundMaterial  
)
ground.rotation.x = -0.5 * Math.PI;
ground.position.y = -1.501;
ground.receiveShadow = true;
scene.add(ground)


// Walls
const wallTexture = textureLoader.load('textures/ALS-wall.png');
const wallMaterial = new THREE.MeshStandardMaterial({map: wallTexture});
/**
 * Front Wall
 */
const fWall = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30, 15),
  wallMaterial  
)
fWall.position.y = 5.999;
fWall.position.z = -15;

scene.add(fWall)

const RWall = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30, 15),
  wallMaterial  
)
RWall.rotation.y = -0.5*Math.PI;
RWall.position.x = 15
RWall.position.y = 5.999;

scene.add(RWall)

const LWall = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30, 15),
  wallMaterial  
)
LWall.rotation.y = 0.5*Math.PI;
LWall.position.x = -15
LWall.position.y = 5.999;

scene.add(LWall)


const BWall = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30, 15),
  wallMaterial  
)
BWall.rotation.x = Math.PI;
BWall.position.z = 15
BWall.position.y = 5.999;

scene.add(BWall)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 15;
controls.minDistance = 3;
controls.enablePan = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.position.y = Math.sin(8 * elapsedTime);
  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.z = Math.cos(elapsedTime * 0.5)

  // update Material
  boxMaterial.map = materialTexture;
  boxMaterial.alphaMap = alphaTexture;
  sphereMaterial.matcap = matcapTexture;


  scene.remove(scene.getObjectByName('light'))
  scene.add(light)

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
