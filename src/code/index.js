const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 10;
let y = 10;
const playerWidth = 150;
const playerHeight = 150;
const step = 5; // Smaller step for smoother movement

let currentDirection = null; // Tracks the current direction ('w', 'a', 's', 'd')

// Load the image
let img = new Image();
img.src = "../resources/playedgamesbefore.jpg";

// Play audio
function playedthese() {
    const audio = new Audio("../resources/i-play-these-games-before.mp3");
    audio.play();
}

// Draw the player
function drawPlayer(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(img, x, y, playerWidth, playerHeight);
}

// Update the player position
function update() {
    if (currentDirection) {
        switch (currentDirection) {
            case 'w':
                y -= step;
                y = Math.max(0, y); // Prevent going out of bounds
                break;
            case 's':
                y += step;
                y = Math.min(canvas.height - playerHeight, y);
                break;
            case 'a':
                x -= step;
                x = Math.max(0, x);
                break;
            case 'd':
                x += step;
                x = Math.min(canvas.width - playerWidth, x);
                break;
        }
    }
    drawPlayer(x, y);
    requestAnimationFrame(update); // Continue the game loop
}

// Handle keydown events
document.addEventListener('keydown', (e) => {
    const validKeys = ['w', 'a', 's', 'd'];
    if (validKeys.includes(e.key)) {
        currentDirection = e.key; // Update the current direction
    }
});

// Handle keyup events
document.addEventListener('keyup', (e) => {
    if (e.key === currentDirection) {
        currentDirection = null; // Stop movement if the current direction key is released
    }
});

// Start the game loop
update();
