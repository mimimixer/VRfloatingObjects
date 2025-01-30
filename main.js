import * as THREE from 'three';
import SpiralObject from './SpiralObject.js';
import ScreensArray from './ScreensArray.js';
import VideoArray from './VideoArray.js';
import WebGL from './dependencies/WebGL.js';
import {OrbitControls} from './dependencies/OrbitControls.js';
import { VRButton } from './dependencies/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set( 15, 11, 3 ); // Set the camera positionccc
function logCameraPosition() {
    console.log("Camera Position:", camera.position);
    console.log("Camera Target (LookAt):", controls.target);
}
// Add an event listener to log the camera position whenever you rotate
window.addEventListener("dblclick", () => {
    logCameraPosition();
});

const renderer = new THREE.WebGLRenderer({alpha: false}); //JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser without the use of plug-ins.[2] 
//renderer.setClearColor(0x000000, 0); // Transparent background
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer)); // Add a VR button to enter VR mode
document.addEventListener("keydown", (event) => {
    if (event.key === 'Escape') { // Press 'Escape' to exit VR
        exitVR();
    }
});

//controls for moving the camera
const controls = new OrbitControls( camera, renderer.domElement ); // makes the camera moveable
controls.enableZoom = true; // Enable zooming
controls.minDistance = 10;
controls.maxDistance = 500;

//introduce path, create screens, define number of screens and speed
const curveOfThePath = new SpiralObject(3, 15, 15, 200, 0x00ffff); //turns = 3, radius = 5, height = 10, segments = 200, color = 0x0077ff);
curveOfThePath.addToScene(scene); //and add it to the scene
const curve = curveOfThePath.createSpiralMesh().geometry.parameters.path; //get the path of the spiral
const curveLength = curve.getLength(); //get the length of the path
console.log("curve length = " + curveLength);
const numScreens = 100;
const speed = 0.00003; // Constant speed for all screens

let staticOrMoving = true; //true = moving, false = static
let folder = "";
let array = [];
if (staticOrMoving == true) {
    folder = "./images/";
    array = new ScreensArray(curve, numScreens, folder, scene);
} else {
    folder = "./Videos-001/";
    array = new VideoArray(curve, numScreens, folder, scene);
}
//const imageFolder = "./images/";
//const screensArray = new ScreensArray(curve, numScreens, folder, scene);
//const videoFolder = "./Videos-001/";
//const videoArray = new VideoArray(curve, numScreens, folder, scene);

function animate() {
    array.animate(speed);
    controls.update(); // Optional: Keep camera controls in VR
    renderer.render(scene, camera);
}

if ( WebGL.isWebGL2Available() ) {
	// Initiate function or other initializations here
    renderer.setAnimationLoop( animate );
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}