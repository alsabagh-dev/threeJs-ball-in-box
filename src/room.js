/**
 * @description A function to Build a room in a scene
 * @author Abdelaziz Alsabagh
 * @Date 8th of Mar 2023
 */

// =========== Imports ===========
import * as THREE from 'three';

/**
 * Adds a room to the scene.
 * 
 * @param scene         The Scene to add the room to.
 * @param textureLoader To load the textures
 * 
 * @returns {void}
 */
const BuildRoom = (scene, textureLoader) => {
  // ***** Floor *****
  /** Floor texture */
  const groundTexture = textureLoader.load('textures/ALS-ground.png');
  /** Floor material */
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    color: 0xfaf0e6,
  });
  /** Floor */
  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 30),
    groundMaterial
  );
  // Rotate it
  ground.rotation.x = -0.5 * Math.PI;
  // Lower it to be right under the box
  ground.position.y = -1.501;
  // Allow the shadows to be drawn over it
  ground.receiveShadow = true;
  // Add Floor to the scene
  scene.add(ground);

  // ***** Walls *****
  /** Walls texture */
  const wallTexture = textureLoader.load('textures/ALS-wall.jpg');
  /** Walls material */
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  // ###### Front Wall #######
  /** Front Wall */
  const fWall = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 15),
    wallMaterial
  );
  // Move it up.
  fWall.position.y = 5.999;
  // Move it backoward.
  fWall.position.z = -15;
  // Add Front wall to the sence
  scene.add(fWall);

  // ###### Right Wall #######
  /** Right Wall */
  const RWall = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 15),
    wallMaterial
  );
  // Rotate it.
  RWall.rotation.y = -0.5 * Math.PI;
  // Move it to the right
  RWall.position.x = 15;
  // Move it up.
  RWall.position.y = 5.999;
  // Add Right wall to the scene
  scene.add(RWall);

  // ###### Left Wall #######
  /** Left Wall */
  const LWall = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 15),
    wallMaterial
  );
  // Rotate it.
  LWall.rotation.y = 0.5 * Math.PI;
  // Move it Left.
  LWall.position.x = -15;
  // Move it up.
  LWall.position.y = 5.999;
  // Add left wall to the scene
  scene.add(LWall);

  // ###### Back wall #######
  /** Back wall */
  const BWall = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 15),
    wallMaterial
  );
  // Rotate it.
  BWall.rotation.x = Math.PI;
  // Move it forward.
  BWall.position.z = 15;
  // Move it up.
  BWall.position.y = 5.999;
  // Add Back Wall to the scene
  scene.add(BWall);
};
// Export the function
export default BuildRoom;