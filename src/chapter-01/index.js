import THREE from '../three.js';

const canvasWrap = document.getElementById('canvasWrap');

console.log(THREE.Scene);

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

    // 平面
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    // 也就是 y z 平面上
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    // 立方体
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        // 只渲染线框
        wireframe: true
    });
    // 默认位置都是重心位于 0,0,0 .
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    // 球
    const sphereGeometry = new THREE.SphereGeometry(Math.PI);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    // 帮助debug用的, x 红色, y 绿色, z 蓝色
    // 右手坐标系
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

init();
