import * as THREE from 'three';

class ScreensArray {
    constructor(curve, numScreens, imageFolder, scene) {
        this.curve = curve; // Path the screens will follow
        this.numScreens = numScreens; // Number of screens
        this.imageFolder = imageFolder; // Folder containing textures
        this.scene = scene;
        this.screens = []; // Array to hold screen objects
        this.textureLoader = new THREE.TextureLoader();
        //this.computeEqualLengthTable(); // Precompute equal-length table
        this.createScreens(); // Create the screens and place them along the curve
    }


    createScreens() {
        //const screenPositions = this.computeEqualLengthTable(); // Precompute equal-length table
        for (let i = 0; i < this.numScreens; i++) {
            const imagePath = this.imageFolder + "image" + (i +1) + ".jpg"; //create the path to the image
            console.log("imagePath = " + imagePath);
            const texture = this.textureLoader.load(
                imagePath,
                () => console.log(`Loaded texture: ${imagePath}`),
                undefined,
                (err) => console.error(`Failed to load texture: ${imagePath}`, err)
            ); //, (texture) => { //load the image
            const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); //create a new material
            const screenGeometry = new THREE.PlaneGeometry(5, 3); // 2x1 screen
            const screen = new THREE.Mesh(screenGeometry, screenMaterial); //create a new screen

            this.screens.push({ mesh: screen, t: i/this.numScreens }); // Store mesh and t value
            this.scene.add(screen);
                
            // Calculate initial position and orientation of each screen
            const position = this.curve.getPoint(i/this.numScreens);
            const tangent = this.curve.getTangent(i/this.numScreens).normalize();
            screen.position.copy(position);

            // Compute orientation (orthogonal to the floor)
            const up = new THREE.Vector3(0, 1, 0); // Fixed "up" direction
            const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
            const adjustedUp = new THREE.Vector3().crossVectors(tangent, right).normalize();
            const rotationMatrix = new THREE.Matrix4().makeBasis(right, adjustedUp, tangent);
            screen.setRotationFromMatrix(rotationMatrix);
        }
    }

    addToScene(scene) {
        this.screens.forEach(screenData => {
                   sscene.add(screenData.mesh);
        });
    }

    animate(speed) {
        for (const currentScreen of this.screens) {
            currentScreen.t += speed;
            if (currentScreen.t > 1) currentScreen.t -= 1; // Loop back to start

            const currentPosition = this.curve.getPoint(currentScreen.t);
            const currentTangent = this.curve.getTangent(currentScreen.t).normalize();
            currentScreen.mesh.position.copy(currentPosition);

            // Update rotation
            const currentUp = new THREE.Vector3(0, 1, 0);
            const curentRight = new THREE.Vector3().crossVectors(currentUp, currentTangent).normalize();
            const currentAdjustedUp = new THREE.Vector3().crossVectors(currentTangent, curentRight).normalize();
            const currentRotationMatrix = new THREE.Matrix4().makeBasis(curentRight, currentAdjustedUp, currentTangent);
            currentScreen.mesh.setRotationFromMatrix(currentRotationMatrix);
        }
    }
}

export default ScreensArray;