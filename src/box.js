/**
 * @description A function to Build a box in a scene
 * @author Abdelaziz Alsabagh
 * @Date 8th of Mar 2023
 */

// =========== Imports ===========
import * as THREE from 'three';

/**
 * Adds a Box to the scene.
 *
 * @param scene         The Scene to add the box to.
 * @param textureLoader To Load texture.
 * @param GUI           To add ball tweaking options
 * @param params        To hold UI options
 *
 * @returns {void}
 */
export default function BuidlBox(scene, textureLoader, GUI, params) {
  /** Cage materials. contains all materials preloaded */
  const MaterialTextures = {
    wood: textureLoader.load('/textures/ALS-wood.png'),
    iron: textureLoader.load('/textures/ALS-iron.png'),
    bricks: textureLoader.load('/textures/ALS-brick.png'),
  };

  /** Cage bars styles. contains all styles preloaded  */
  const CageStyles = {
    als: textureLoader.load('/textures/ALS-alpha.png'),
    wire: textureLoader.load('/textures/wire-alpha.png'),
    wire2: textureLoader.load('/textures/wire2-alpha.png'),
    cross: textureLoader.load('/textures/cross-alpha.png'),
    bars: textureLoader.load('/textures/bars-alpha.png'),
  };

  /** Cage material */
  let materialTexture = MaterialTextures.iron;
  /** Cage bars style */
  let alphaTexture = CageStyles.als;

  /** Cage Geomerty. use Buffer version as it's better for performance */
  const boxGeometry = new THREE.BoxBufferGeometry(3, 3, 3);
  /** Cage Material */
  const boxMaterial = new THREE.MeshStandardMaterial({ map: materialTexture });

  // Draw on both sides.
  boxMaterial.side = THREE.DoubleSide;
  // Define trasparent parts.
  boxMaterial.alphaMap = alphaTexture;
  // Allow transparency.
  boxMaterial.transparent = true;
  // Shadow tranparency.
  boxMaterial.alphaTest = 0.5;
  // Create the cage.
  /** Cage */
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  // Allow it to draw shadow.
  box.castShadow = true;
  // Add cage to the scene.
  scene.add(box);

  // ####### Update Cage Material ########
  GUI.add(params, 'material', ['Wood', 'Iron', 'Bricks'])
    .name('Material')
    .onChange((event) => {
      boxMaterial.map = MaterialTextures[event.toLowerCase()];
    });

  // ####### Update Cage Style ########
  GUI.add(params, 'cage', ['ALS', 'Wire', 'Wire2', 'Cross', 'bars'])
    .name('Cage Style')
    .onChange((event) => {
      boxMaterial.alphaMap = CageStyles[event.toLowerCase()];
    });

}
