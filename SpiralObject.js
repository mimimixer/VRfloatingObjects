import * as THREE from 'three';

class SpiralObject {
    constructor(turns = 3, radius = 5, height = 10, segments = 200, color = 0x0077ff) {
        this.turns = turns;        // Number of turns in the spiral
        this.radius = radius;      // Radius of the spiral
        this.height = height;      // Height of the spiral
        this.segments = segments;  // Number of segments for smoothness
        this.color = color;        // Color of the spiral
        this.mesh = this.createSpiralMesh(); // Create the spiral mesh
    }

    createSpiralMesh() {
        const points = [];
        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * this.turns * Math.PI * 2;

            // Spiral positions
            const tx = this.radius * Math.cos(3 * t);
            const y = (this.height / (this.turns  * Math.PI)) * t;
            const tz = this.radius * Math.sin(2 * t);

            // Möbius-style twist
            //const twist = Math.sin(t / 2);
            //const tx = x * Math.cos(twist) - z * Math.sin(twist);
            //const tz = x * Math.sin(twist) + z * Math.cos(twist);

            points.push(new THREE.Vector3(tx, y, tz));
        }

        // Create curve and tube geometry
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 200, 0.2, 8, false);

        // Create material and mesh
        const material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: false , transparent: true, opacity: 0,      });
        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }

    addToScene(scene) {
        scene.add(this.mesh); // Add the spiral mesh to the given scene
    }

    rotate(speedX = 0, speedY = 0.01, speedZ = 0) {
        // Rotate the spiral around its axes
        this.mesh.rotation.x += speedX;
        this.mesh.rotation.y += speedY;
        this.mesh.rotation.z += speedZ;
    }
}

export default SpiralObject;

/*
// Create a spiral curve
const points = [];
const turns = 3;
const segments = 500;
for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * turns * Math.PI * 2;
    const x = Math.cos(t) * 5;
    const y = (i / segments) * 5;
    const z = Math.sin(t) * 5;
    points.push(new THREE.Vector3(x, y, z));
}
const curve = new THREE.CatmullRomCurve3(points);

// Create a tube geometry to visualize the curve
const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(tube);
*/