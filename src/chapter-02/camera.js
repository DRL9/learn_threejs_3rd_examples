import THREE from '../three.js';
import { initBase } from '../utils.js';
import dat from '../dat.gui.js';

function init() {
    let { stat, scene, camera, renderer } = initBase();

    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-0.5 * Math.PI);

    scene.add(plane);
    addCube(scene);

    let trackballControls = window.initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    const controls = new (function () {
        this.switchCamera = () => {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(
                    window.innerWidth / -20,
                    window.innerWidth / 20,
                    window.innerHeight / -20,
                    window.innerHeight / 20
                );
            } else {
                camera = new THREE.PerspectiveCamera(
                    50,
                    window.innerWidth / window.innerHeight
                );
            }
            camera.position.set(20, 20, 20);
            camera.lookAt(scene.position);
            trackballControls = window.initTrackballControls(camera, renderer);
        };
        this.lookatX = 0;
        this.lookatY = 0;
        this.lookatZ = 0;
    })();
    function render() {
        stat.update();
        trackballControls.update(clock.getDelta());
        camera.lookAt(controls.lookatX, controls.lookatY, controls.lookatZ);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();

    const gui = new dat.GUI();
    gui.add(controls, 'switchCamera').listen();
    gui.add(controls, 'lookatX', -20, 20);
    gui.add(controls, 'lookatY', -20, 20);
    gui.add(controls, 'lookatZ', -20, 20);
}
init();

function addCube(scene) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const material = new THREE.MeshBasicMaterial({
                color: i * j * 2000
            });
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(i * 2, 10, j * 2);
            scene.add(mesh);
        }
    }
}
