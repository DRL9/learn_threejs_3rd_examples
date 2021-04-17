import THREE from '../three.js';
import dat from '../dat.gui.js';
import { initStats } from '../utils';

const canvasWrap = document.getElementById('canvasWrap');

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight
    );
    /**
     * @description 虽然还有 CanvasRenderer, SVGRenderer等, 但是不推荐使用, 因为缺少功能， 并且是cpu密集的
     */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasWrap.appendChild(renderer.domElement);

    addPlane(scene);
    const sphere = addSphere(scene);
    const cube = addCube(scene);

    // 帮助debug用的, x 红色, y 绿色, z 蓝色
    // 右手坐标系
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const spotLight = addSpotLight(scene);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    enableShadow(scene, renderer, spotLight);

    // 控制相机位置
    const trackerController = window.initTrackballControls(camera, renderer);
    // 简单计算每一帧的时间
    const clock = new THREE.Clock();

    let stats = initStats();
    const controller = initDatGUI();
    let i = 0;
    function render() {
        trackerController.update(clock.getDelta());

        cube.position.setX((cube.position.x + 0.1) % 50);
        sphere.position.set(
            controller.radius *
                Math.cos(i++ * Math.PI * controller.rotationSpeed),
            sphere.position.y,
            controller.radius * Math.sin(i * Math.PI * controller.rotationSpeed)
        );
        renderer.render(scene, camera);
        stats.update();
        requestAnimationFrame(render);
    }
    render();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        // 记得调用这个
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

init();

/**
 *
 * @param {THREE.Scene} scene
 */
function addPlane(scene, useBasicMaterial) {
    // 平面
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = useBasicMaterial
        ? new THREE.MeshBasicMaterial({
              color: 0xaaaaaa
          })
        : new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    // 也就是 y z 平面上
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    return plane;
}
/**
 *
 * @param {THREE.Scene} scene
 * @param {boolean} useBasicMaterial
 */
function addCube(scene, useBasicMaterial) {
    // 立方体
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = useBasicMaterial
        ? new THREE.MeshBasicMaterial({
              color: 0xff0000,
              // 只渲染线框
              wireframe: true
          })
        : new THREE.MeshLambertMaterial({ color: 0xff0000 });
    // 默认位置都是重心位于 0,0,0 .
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);
    return cube;
}

/**
 *
 * @param {THREE.Scene} scene
 * @param {boolean} useBasicMaterial
 *
 */
function addSphere(scene, useBasicMaterial) {
    // 球
    const sphereGeometry = new THREE.SphereGeometry(Math.PI);
    const sphereMaterial = useBasicMaterial
        ? new THREE.MeshBasicMaterial({
              color: 0x7777ff,
              wireframe: true
          })
        : new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    return sphere;
}

/**
 * @note MeshBasicMaterial 不会响应光源， 但是MeshLambertMaterial,MeshPhysicalMaterial,MeshStandardMaterial 可以
 * @param {THREE.Scene} scene
 */
function addSpotLight(scene) {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, -15);

    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);
    return spotLight;
}

/**
 * 投影要设置的属性
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.SpotLight} spotLight
 */
function enableShadow(scene, renderer, spotLight) {
    renderer.shadowMap.enabled = true;
    spotLight.castShadow = true;
    scene.children.forEach(
        /**
         *
         * @param {THREE.Mesh} mesh
         */
        (mesh) => {
            if (mesh.geometry instanceof THREE.PlaneGeometry) {
                mesh.receiveShadow = true;
            } else {
                mesh.castShadow = true;
            }
        }
    );
}

function initDatGUI() {
    class Control {
        constructor() {
            this.rotationSpeed = 0.008;
            this.radius = 11;
        }
    }
    let c = new Control();
    const gui = new dat.GUI();
    gui.add(c, 'rotationSpeed', 0, 0.1);
    gui.add(c, 'radius', 1, 15);
    return c;
}
