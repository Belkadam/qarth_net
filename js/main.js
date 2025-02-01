// Initialization of the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Add an ambient light to illuminate the logo
const light = new THREE.AmbientLight(0x404040, 1); // Soft light
scene.add(light);

// Define a custom ShaderMaterial to apply a gradient effect
const vertexShader = `
    varying float vGray;
    void main() {
        // Calculate the gradient based on the Y position of the points
        vGray = (position.y + 1.0) / 2.0; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying float vGray;
    void main() {
        // Apply the gradient of gray from black (bottom) to white (top)
        gl_FragColor = vec4(vec3(vGray), 1.0);
    }
`;

// Create the material with the gradient shader
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide
});

// Define the points to draw the "Q" (with the bottom bar)
const points = [];
const radius = 1;  // Radius of the circle for the letter "Q"

// Create a circle to form the letter "Q"
const numSegments = 50; // Number of segments for the circle
for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2; // Angle for each segment
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
}

// Add the bottom bar of the "Q"
points.push(new THREE.Vector3(0.7, -0.7, 0)); // Position of the bar of the "Q"

// Create the geometry for the "Q" (wireframe line)
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.LineLoop(geometry, material); // Use a LineLoop to create a closed loop
scene.add(line);

// Center the "Q" in the scene
line.position.set(0, 0, 0);

// Position the camera for the scene
camera.position.z = 5;

// Animate the logo (rotation around the Y axis only)
function animate() {
    requestAnimationFrame(animate);

    // Rotate the "Q" around the Y axis (horizontal rotation)
    line.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Adjust the renderer size on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
