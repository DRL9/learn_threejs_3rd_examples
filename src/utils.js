import Stats from './stats.js';
import THREE from './three.js';

export function initStats(type) {
    var panelType =
        typeof type !== 'undefined' && type && !isNaN(type)
            ? parseInt(type)
            : 0;
    var stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
}

export function initBase() {
    const stat = initStats();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#canvasWrap').appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
    camera.position.set(40, 40, 40);
    camera.lookAt(scene.position);

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    return {
        scene,
        camera,
        renderer,
        stat
    };
}

/**
 * 投影要设置的属性
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.SpotLight} spotLight
 */
export function enableShadow(scene, renderer, spotLight) {
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
