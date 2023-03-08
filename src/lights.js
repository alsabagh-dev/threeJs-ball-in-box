/**
 * @description A function to add lights to the scene
 * @author Abdelaziz Alsabagh
 * @Date 8th of Mar 2023
 */

// =========== Imports ===========
import * as THREE from 'three';

/**
 * Adds a Box to the scene.
 *
 * @param scene         The Scene to add the light to.
 * @param GUI           To add ball tweaking options
 * @param params        To hold UI options
 *
 * @returns {void}
 */
export default function AddLight(scene, GUI, params) {
  /** backlight used a light reflection to light backsides */
  const backLight = new THREE.AmbientLight(0xffffff, 0.3);
  // Add backlight to the scene
  scene.add(backLight);

  /** Light Types */
  const Lights = {
    directional: new THREE.DirectionalLight(0xffffff),
    hemisphere: new THREE.HemisphereLight(0xffffff, 0x0000ff, 1),
    point: new THREE.PointLight(0xffffff, 1, 100),
  };

  /** used light in scene. default (directional) */
  let light;

  const setLight = (lightName) => {
    scene.remove(scene.getObjectByName('light'));
    light = Lights[lightName.toLowerCase()];
    light.name = 'light';
    lightName !== 'hemisphere' && (light.castShadow = true);
    light.position.set(5, 5, 5);
    light.color = new THREE.Color(params.color);
    scene.add(light);
  };

  // set default light
  setLight('directional');

  // ####### Update light ########
  GUI.add(params, 'light', ['directional', 'hemisphere', 'point'])
    .name('Light Type')
    .onChange((event) => {
      setLight(event);
    });

  // ####### Update light color ########
  GUI.addColor(params, 'color')
    .name('Light color')
    .onChange((event) => {
      light.color = new THREE.Color(event);
    });

  // ####### Update light Position ########
  /** GUI Folder */
  const GUILightPosition = GUI.addFolder('Light Position');
  // ******* Update light X Position *******
  GUILightPosition.add(light.position, 'x')
    .max(10)
    .min(-10)
    .step(0.1)
    .name('X')
    .onChange((e) => {
      light.position.set(e, params.lightY, params.lightZ);
    });
  // ******* Update light Y Position *******
  GUILightPosition.add(light.position, 'y')
    .max(15)
    .min(1.5)
    .step(0.1)
    .name('Y')
    .onChange((e) => {
      light.position.set(params.lightX, e, params.lightZ);
    });
  // ******* Update light Z Position *******
  GUILightPosition.add(light.position, 'z')
    .max(10)
    .min(0.0)
    .step(0.1)
    .name('Z')
    .onChange((e) => {
      light.position.set(params.lightX, params.lightY, e);
    });
}
