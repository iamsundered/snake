const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");

canvas.style.position = "relative";
canvas.style.display = "block";

body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 100;
let y = 100;
const playerWidth = 150;
const playerHeight = 150;
const step = 5;

let currentDirection = null;

let img = new Image();
img.src = "../resources/playedgamesbefore.jpg";

function playedthese() {
    const audio = new Audio("../resources/i-play-these-games-before.mp3");
    audio.play();
}

function drawPlayer(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
    ctx.drawImage(img, x, y, playerWidth, playerHeight);
}
let oldX = null;
let oldY = null;
function update() {
    /*if (y ===! Math.max(0, y) || y ===! Math.min(canvas.width, canvas.height) ||
        x ===! Math.max(0, x) || x ===! Math.min(canvas.width - playerWidth, x)) {
        gameOver();
    }*/

    oldX = x;
    oldY = y;


    if (currentDirection) {
        switch (currentDirection) {
            case 'w':
                y -= step;
                y = Math.max(0, y); // prevent going out of bounds
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

    if (oldX === x && oldY === y) {
        gameOver();
    }

    drawPlayer(x, y);
    requestAnimationFrame(update); //continue game loop
}

const gameOverScreen = document.createElement('div')


function gameOver() {
    const endText = document.createElement("h1");
    const node = document.createTextNode("This is new.");

    endText.appendChild(node);
    body.appendChild(endText);

}


// key is pressed:
document.addEventListener('keydown', (e) => {
    const validKeys = ['w', 'a', 's', 'd'];
    if (validKeys.includes(e.key)) {
        currentDirection = e.key; //update the current direction
    }
});

// key is released:
/*
document.addEventListener('keyup', (e) => {
    if (e.key === currentDirection) {
        currentDirection = null; //stop movement if the current direction key is released
    }
});*/

//start the game loop
update();



