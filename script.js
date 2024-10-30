// Select the canvas element from the HTML
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Set canvas size to full screen dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas dynamically when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Array to store active rockets and sparkles for rendering
let fireRocketsArray = [];
let fireRocketsSparklesArray = [];

// Constructor function for a Rocket
function FireRockets(x, y) {
    // Set rocket position to mouse location if provided, else random x and bottom y
    this.x = x || Math.floor(Math.random() * window.innerWidth);
    this.y = y || window.innerHeight;

    // Rocket properties
    this.color = `hsl(${Math.floor(Math.random() * 360)},70%,50%)`;
    this.size = Math.floor(Math.random() * 5 + 5);
    this.speedY = Math.random() * 5 + 5;
    this.crackRocketY = Math.floor(window.innerHeight - ((Math.random() * window.innerHeight) + 100));

    this.update = () => {
        this.y -= this.speedY;  // Move rocket upward
    }

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}

// Constructor function for a Sparkle generated when rocket bursts
function FireRocketsSparkles(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.floor(Math.random() * 3 + 6);
    this.speedY = Math.random() * 2 - 2;
    this.speedX = Math.round((Math.random() - 0.5) * 10);
    this.velocity = Math.random() / 5;

    this.update = () => {
        if (this.size > 0.2) {
            this.size -= 0.1;
        }
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedY += this.velocity;
    }

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}

// Function to render and update rockets
function renderFireRockets() {
    for (let i = 0; i < fireRocketsArray.length; i++) {
        fireRocketsArray[i].draw();
        fireRocketsArray[i].update();
        if (fireRocketsArray[i].y <= fireRocketsArray[i].crackRocketY) {
            for (let index = 0; index < 20; index++) {
                fireRocketsSparklesArray.push(new FireRocketsSparkles(fireRocketsArray[i].x, fireRocketsArray[i].y, fireRocketsArray[i].color));
            }
            fireRocketsArray.splice(i, 1);
            i--;
        }
    }
}

// Function to render and update sparkles
function renderFireRocketsSparkles() {
    for (let i = 0; i < fireRocketsSparklesArray.length; i++) {
        fireRocketsSparklesArray[i].draw();
        fireRocketsSparklesArray[i].update();
        if (fireRocketsSparklesArray[i].size <= 0.2) {
            fireRocketsSparklesArray.splice(i, 1);
            i--;
        }
    }
}

// Main animation loop
function animate() {
    context.fillStyle = `rgba(24,28,31,0.2)`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    renderFireRockets();
    renderFireRocketsSparkles();

    requestAnimationFrame(animate);
}

// Start the animation loop
animate();

// Add rockets periodically at random locations
setInterval(() => {
    for (let i = 0; i < 4; i++) {
        fireRocketsArray.push(new FireRockets());
    }
}, 600);

// Add a mousemove event listener to trigger a firework at mouse location
canvas.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    // Add a new rocket at the mouse position
    fireRocketsArray.push(new FireRockets(x, y));
});
