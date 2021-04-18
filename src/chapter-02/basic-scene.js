import THREE from '../three.js';
import { initBase, enableShadow } from '../utils.js';
import dat from '../dat.gui.js';

function init() {
    const { camera, stat, renderer, scene } = initBase();

    // 添加迷雾
    // 线性增加浓度
    scene.fog = new THREE.Fog(0xffffff, 5, 100);
    // 指数增加浓度
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);

    // 忽略children 设置的 material, 都使用这个。 这样可以有更好的性能
    scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });

    const planeGeometry = new THREE.PlaneGeometry(40, 40);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    const controls = addControls(scene, planeGeometry);

    // var ambientLight = new THREE.AmbientLight(0x3c3c3c);
    // scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 20, 20);
    scene.add(spotLight);

    enableShadow(scene, renderer, spotLight);

    // attach them here, since appendChild needs to be called first
    const trackballControls = window.initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    function render() {
        stat.update();
        trackballControls.update(clock.getDelta());

        // 遍历所有child, 包括child的 children
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}

init();

function addControls(scene, planeGeometry) {
    var controls = new (function () {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function () {
            var cubeSize = Math.ceil(Math.random() * 3);
            var cubeGeometry = new THREE.BoxGeometry(
                cubeSize,
                cubeSize,
                cubeSize
            );
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = 'cube-' + scene.children.length;

            // position the cube randomly in the scene

            cube.position.x =
                -30 +
                Math.round(Math.random() * planeGeometry.parameters.width);
            cube.position.y = Math.round(Math.random() * 5);
            cube.position.z =
                -20 +
                Math.round(Math.random() * planeGeometry.parameters.height);

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function () {
            console.log(scene.children);
        };
    })();

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    return controls;
}
