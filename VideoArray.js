import * as THREE from 'three';

class VideoArray {
    constructor(curve, numScreens, videoFolder, scene) {
        this.curve = curve; // Path the screens will follow
        this.numScreens = numScreens; // Number of screens
        this.videoFolder = videoFolder; // Folder containing textures
        //this.apiUrl = apiUrl; // Folder containing textures
        //this.apiKey = apiKey; // API key for the video data
        this.scene = scene;
        this.screens = []; // Array to store the screen objects
        //this.videoTexture = new THREE.VideoTexture();

        //this.loadVideos(); // Load video elements
        this.createVideoScreens(); // Create the screens with video textures
        // Fetch video data and initialize screens
        //this.loadVideoData().then((videos) => {
        //    this.createScreens(videos);
        //});
    }

    // Create screens with video textures
    createVideoScreens() {
                //const screenPositions = this.computeEqualLengthTable(); // Precompute equal-length table
                for (let i = 0; i < this.numScreens; i++) {
                    const videoIndex = (i % 18) + 1; // 18 videos in the folder
                    const videoPath = this.videoFolder + "video" + videoIndex + ".TS.mp4";
                    console.log("video Path = " + videoPath);
                    const video = document.createElement("video");
                    video.src = videoPath;
                    video.loop = true;
                    video.muted = true; // Muted to autoplay in some browsers
                    video.playsInline = true; // For compatibility in VR and mobile browsers
                    video.autoplay = true;
                    video.load(); // Start the video
                    //this.videoTexture.load(videoPath);
                    const videoTexture = new THREE.VideoTexture(video);
                    
                    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide }); //create a new material
                    const videoGeometry = new THREE.PlaneGeometry(5, 3); // 2x1 screen
                    const screenMesh = new THREE.Mesh(videoGeometry, videoMaterial); //create a new screen
        
                    this.screens.push({ mesh: screenMesh, t: i/this.numScreens , video, texture: videoTexture}); // Store mesh and t value
                    this.scene.add(screenMesh);
                        
                    // Calculate initial position and orientation of each screen
                    const position = this.curve.getPoint(i/this.numScreens);
                    const tangent = this.curve.getTangent(i/this.numScreens).normalize();
                    screenMesh.position.copy(position);
        
                    // Compute orientation (orthogonal to the floor)
                    const up = new THREE.Vector3(0, 1, 0); // Fixed "up" direction
                    const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
                    const adjustedUp = new THREE.Vector3().crossVectors(tangent, right).normalize();
                    const rotationMatrix = new THREE.Matrix4().makeBasis(right, adjustedUp, tangent);
                    screenMesh.setRotationFromMatrix(rotationMatrix);

                    // Start playing the video (required in some cases after setup)
                    video.play().catch((error) => {
                        console.error("Error playing video:", videoPath, error);
                    });
                }
            }


    // Animate the screens along the curve
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
export default VideoArray;



