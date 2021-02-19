//create scene
var scene = new THREE.Scene();

//has 4 parameters
var camera = new THREE.PerspectiveCamera
    //field of view
    (60,
        //aspect ratio
        1000 / 400,
        0.1,
        1000)

camera.position.z = 2.5;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#FFFFFF");//background color
renderer.setSize(200, 200);

document.body.appendChild(renderer.domElement); //create canvas element with renderer settings


 //dynamically resizes canvas with change in window
function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}


var texture = new THREE.TextureLoader().load('header.png');
var geometry = new THREE.PlaneGeometry(5, 3, 30, 30);
var clock = new THREE.Clock;
var material = new THREE.MeshBasicMaterial({ map: texture });

var flag = new THREE.Mesh(geometry, material);
scene.add(flag);

flag.rotation.set(-0.1, 0,0);

var render = function () {
    const t = clock.getElapsedTime()

    resizeCanvasToDisplaySize();

    flag.geometry.vertices.map(v => {
        const wave1 = 0.5 * Math.sin(v.x * 2 + t *0.9)
        const wave2 = 0.25 * Math.sin(v.x * 3 + t *2)
        const multi = (v.x + 2.5)/5

        v.z = (wave1 + wave2) * multi
    })

    flag.geometry.verticesNeedUpdate = true;

    requestAnimationFrame(render)
    renderer.render(scene, camera);
}

render();