/**
 * @description A function to Build a Ball in a scene
 * @author Abdelaziz Alsabagh
 * @Date 8th of Mar 2023
 */

// =========== Imports ===========
import * as THREE from 'three';

/**
 * Adds a Ball to the scene.
 *
 * @param scene         The Scene to add the ball to.
 * @param textureLoader To Load texture.
 * @param GUI           To add ball tweaking options
 * @param params        To hold UI options
 *
 * @returns sphereMaterial
 */
export default function BuildBall(scene, textureLoader, GUI, params) {
  /** Ball styles. contains all styles preloaded */
  const matcaps = [
    textureLoader.load('/textures/matcaps/1.png'),
    textureLoader.load('/textures/matcaps/2.png'),
    textureLoader.load('/textures/matcaps/3.png'),
    textureLoader.load('/textures/matcaps/4.png'),
    textureLoader.load('/textures/matcaps/5.png'),
    textureLoader.load('/textures/matcaps/6.png'),
    textureLoader.load('/textures/matcaps/7.png'),
    textureLoader.load('/textures/matcaps/8.png'),
  ];
  /** Ball Texture */
  let matcapTexture = matcaps[2];

  /** Ball material */
  const sphereMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  /** Ball */
  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    sphereMaterial
  );
  // Allow ball to draw shadow
  sphere.castShadow = true;
  // Add the ball to the scene.
  scene.add(sphere);

  // ####### Update Ball Style ########
  GUI.add(params, 'matcap', ['1', '2', '3', '4', '5', '6', '7', '8'])
    .name('Ball Style')
    .onChange((event) => {
      matcapTexture = matcaps[+event - 1];
      sphereMaterial.matcap = matcapTexture;
    });

  // ####### Update Ball Color to match light ########
  GUI.onChange(() => {
    sphereMaterial.color = new THREE.Color(params.color);
  });
  return sphere;
}
