import THREE from '../three.js';
import { enableShadow, initBase } from '../utils.js';
import dat from '../dat.gui.js';

function init() {
    const { stat, renderer, scene, camera } = initBase();

    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-0.5 * Math.PI);
    plane.receiveShadow = true;
    scene.add(plane);

    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-10, 10, 20);
    cube.castShadow = true;
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0x0aa0aa, 1);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    scene.add(spotLight);
    spotLight.position.set(-20, 40, 40);
    enableShadow(scene, renderer, spotLight);

    const controls = new (function () {
        this.visibleAmbient = true;
        this.visibleSpot = true;
        this.ambientColor = 0xffffff;
        this.intensity = 1;
    })();

    const gui = new dat.GUI();
    gui.add(controls, 'visibleAmbient', true);
    gui.add(controls, 'visibleSpot', true);
    gui.addColor(controls, 'ambientColor', 0, 0xffffff);
    gui.add(controls, 'intensity', 0, 3, 0.1);

    let trackballControls = window.initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();
    function render() {
        ambientLight.visible = controls.visibleAmbient;
        ambientLight.color = new THREE.Color(controls.ambientColor);
        ambientLight.intensity = controls.intensity;
        spotLight.visible = controls.visibleSpot;

        trackballControls.update(clock.getDelta());
        stat.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}
init();
