const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let posX = null;
let posY = null;
// Character draw

x = 10;
y = 10;
playerWidth = 190;
playerHeight = 150;
step = 150;

let img = new Image();
img.src = "../resources/playedgamesbefore.jpg"
img.style

function playedthese() {
    const audio = new Audio("../resources/i-play-these-games-before.mp3");
    audio.play();
}

function drawSquare(x, y, playerWidth, playerHeight) {
    //ctx.fillStyle = colorRandomizer(); //generates random color each call & assigns it to the square.
    //ctx.fillRect(x, y, playerWidth, playerHeight);
    ctx.drawImage(img, x, y, playerWidth, playerHeight);


}
drawSquare(x, y, playerWidth, playerHeight);
function update() {
    requestAnimationFrame(update);
    draw();
    console.log("x: ", x ," y: " , y)
}

function effects() {
    ctx.rotate(10);
}

function draw() {
    drawSquare(x, y, playerWidth, playerHeight);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            y -= step;
            y = Math.max(0, y); // Prevent y from going below 0
            playedthese();
            break;
        case 's':
            y += step;
            y = Math.min(y, canvas.height - img.height); // Prevent y from exceeding canvas height
            playedthese();
            break;
        case 'a':
            x -= step;
            x = Math.max(0, x); // Prevent x from going below 0
            playedthese();
            break;
        case 'd':
            x += step;
            x = Math.min(x, canvas.width - img.width); // Prevent x from exceeding canvas width
            playedthese();
            break;
    }
    update();
});

function colorRandomizer() {
    const colors = ["red", "green", "blue"];

    let randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
}

x = Math.max(0, Math.min(x, canvas.width - image.width));
y = Math.max(0, Math.min(y, canvas.height - image.height));

update();