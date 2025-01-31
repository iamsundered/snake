const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");

canvas.style.position = "relative";
canvas.style.display = "block";

body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* OOOOOOOOO */
/* OOOOOOOOO */
/* OOOOOOOOO */

/*
const backgroundImage = new Image();
backgroundImage.src = ('resources/images/grassland.gif');

backgroundImage.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.filter = "blur(10px)";
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";
}*/


const gridSize = 40;

// Default player values
const player = {
    x: 80,
    y: 80,
    step: 40,
    trail: 4,
    width: gridSize,
    height: gridSize,
};


function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
    ctx.globalAlpha = 1;
}

const coordsX = [];
const coordsY = [];

function coordinateGeneration() {
    for (let x = 0; x < canvas.width; x += gridSize) {
        coordsX.push(x);
        for (let y = 0; y < canvas.height; y += gridSize) {
            coordsY.push(y);
        }
    }
} coordinateGeneration();

// Aspect ratio finder:
function gcd (a, b) {
    return (b === 0) ? a : gcd (b, a%b);
}
const w = screen.width;
const h = screen.height;
const r = gcd (w, h);

console.log("Aspect ratio: ",w/r, " : ", h/r);


let itemX, itemY;

function generateItems() {
    itemX = coordsX[Math.floor(Math.random() * coordsX.length)];
    itemY = coordsY[Math.floor(Math.random() * coordsY.length)];
    drawItems(itemX, itemY);
}

function collisionCheck(x, y) {
    if (x === player.x && y === player.y) {
        return true;
    }
}
//todo ADD A LIST like drawPlayers loop and make more coords for item gen

const appleTexture = new Image();

appleTexture.src = '/snake/src/resources/images/apple.png';

function drawItems() {
    ctx.fillStyle = "#e63535";
    ctx.drawImage(appleTexture, itemX, itemY, gridSize, gridSize); // draw the item/s
    
    console.log("item is at: " + itemX + "X " + itemY + "Y");
    console.log("player is at: " + player.x + "X " + player.y + "Y");

    if (collisionCheck(itemX, itemY)) { // if player touches item then:
        effectsHandler(1, 0.5);
        player.trail+=1;
        generateItems();
    }
}

// todo NOW ADD STATS AND SETTINGS TO CHANGE MAP STYLE.

function movePlayer(newX, newY) {
    player.x = Math.floor(newX / gridSize)*gridSize;
    player.y = Math.floor(newY / gridSize)*gridSize;
}

// constantly updates and stores all of the snakes(player) body/tail coordinates. 
let oldXPos = [player.x];
let oldYPos = [player.y];

// Direction player goes in:
let currentDirection = null;

const playerTexture = new Image();
playerTexture.src = '/snake/src/resources/images/snake-skin.png';


function drawPlayer() {
    for (let i = 0; i < player.trail; i++) {
        ctx.drawImage(playerTexture, oldXPos[i], oldYPos[i], gridSize, gridSize);
    }

    clearTail();
    selfTailCrashCheck();
}


//clears the trail of the player depending on player.trail value.
function clearTail() {
    if (oldXPos.length === player.trail || oldYPos.length === player.trail) {
        ctx.clearRect(oldXPos[0], oldYPos[0], gridSize, gridSize);
        
        oldXPos.shift();
        oldYPos.shift();
    }
}
// Checks if the player has run into their own tail.
function selfTailCrashCheck() {
    // Removes the player head of the character from the array
    // so that the head doesn't crash into itself.
    let newOldXPos = oldXPos.slice(0, -1);
    let newOldYPos = oldYPos.slice(0, -1);

    for (let i = 0; i < newOldXPos.length; i++) {
        //compares the current coordinates with each pair of old coordinates.
        if (collisionCheck(newOldXPos[i], newOldYPos[i])) {
            gameOver();
        }
    }
}


let timeToUpdate = 100;

document.addEventListener('keydown', (e) => {
    const validKey = ["Control"];
    if (validKey.includes(e.key)) {
        timeToUpdate /= 2;
    }
});

document.addEventListener('keydown', (e) => {
    const validKey = ["Shift"];
    if (validKey.includes(e.key)) {
        timeToUpdate *= 2;
    }
});
document.addEventListener('keydown', (e) => {
    const validKey = [" "];
    if (validKey.includes(e.key)) {
        player.trail += 1;
    }
});

// preloading audio into memory
const diesAudio = new Audio('/snake/src/resources/audio_effects/death.mp3');
const turnAudio = new Audio('/snake/src/resources/audio_effects/move.mp3');

const effectsList = [turnAudio, diesAudio];

function effectsHandler(effect, volume) {

    effectsList[effect].play();
    effectsList[effect].volume = volume;
}

let gameHasEnded = false;
let keyIsPressed = false;

function update() {

    
    const validKeys = ['w', 'a', 's', 'd'];
// key is pressed:
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        // Only updates if a valid key is pressed.
        if (validKeys.includes(key) && !keyIsPressed) {

            // Prevent reversing e.g. if going W, you cant go in S-direction
            if ((key === 'w' && currentDirection !== 's') ||
                (key === 's' && currentDirection !== 'w') ||
                (key === 'a' && currentDirection !== 'd') ||
                (key === 'd' && currentDirection !== 'a')) {
                currentDirection = key;

                effectsHandler(0, 0.2);
                keyIsPressed = true;
            }
        }
    });

    // if given a direction & the player hasn't crashed then move in 'currentDirection'
    if (currentDirection) {
        let x = player.x;
        let y = player.y;
        switch (currentDirection) {
            case 'w':
                y -= player.step;
                movePlayer(x, y);
                keyIsPressed = false;
                break;
            case 's':
                y += player.step;
                movePlayer(x, y);
                keyIsPressed = false;
                break;
            case 'a':
                x -= player.step;
                movePlayer(x, y);
                keyIsPressed = false;
                break;
            case 'd':
                x += player.step;
                movePlayer(x, y);
                keyIsPressed = false;
                break;
        }
        oldXPos.push(x);
        oldYPos.push(y);
        //console.log(oldXPos);
        //console.log(oldYPos);
        //console.log("Current DIRECTION INSIDE UPDATE LOOP UNDER MOVEMENT CHECK: ",currentDirection);

    }

    const topBoundary = 0;
    const bottomBoundary = canvas.height;
    const leftBoundary = 0;
    const rightBoundary = canvas.width;

    // Checks if player hit the edge of the map, if so then the game ends.
    if (player.x >= Math.max(rightBoundary+39 - player.width, 0) || player.x <= Math.min(leftBoundary-39, player.x) ||
        player.y >= Math.max(bottomBoundary+39 - player.height, 0) || player.y <= Math.min(topBoundary-39, player.y)) {
            gameOver();
    }
    drawGrid();
    drawPlayer();
    drawItems();
    
    if (!gameHasEnded) {
        setTimeout(update, timeToUpdate);
        //requestAnimationFrame(update); // calls game loop again.
    }
} //update ends


const playScreen = document.getElementById('playScreen');
const playScreenText = document.getElementById('losingScreenText');

const settingsScreen = document.getElementById('settingsScreen');
const statScreen = document.getElementById('statScreen');

const menuContainer = document.getElementById('menuContainer');

function menuBackgroundColor(menu, body1, body2, color1, color2) {
    menu.style.background = "linear-gradient(to bottom, "+color1+", "+ color2+")";
    document.body.style.background = "linear-gradient(to bottom, "+body1+", "+ body2+")";
    document.body.style.opacity = "0.7"; // make it only change background and not buttons etc
}

let bodyColor1 = document.getElementById('bodyColor1');
let bodyColor2 = document.getElementById('bodyColor2');
let accent1 = document.getElementById('color1');
let accent2 = document.getElementById('color2');

// Theme customization:
document.addEventListener('input', (e) => {
    if (e.target.id === 'bodyColor1') {
        bodyColor1.value = e.target.value;
    } else if (e.target.id === 'bodyColor2') {
        bodyColor2.value = e.target.value;
    }
    else if (e.target.id === 'color1') {
        accent1.value = e.target.value;
    } else if (e.target.id === 'color2'){
        accent2.value = e.target.value;
    }
    console.log(accent1.value + ", "+ accent2.value);
    
    menuBackgroundColor(playScreen, bodyColor1.value, bodyColor2.value, accent1.value, accent2.value);
    menuBackgroundColor(settingsScreen, bodyColor1.value, bodyColor2.value, accent1.value, accent2.value);
    menuBackgroundColor(statScreen, bodyColor1.value, bodyColor2.value, accent1.value, accent2.value);
})

menuBackgroundColor(playScreen, bodyColor1, bodyColor2, accent1, accent2);


// Initialize gifs into memory
const gif1 = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2pvbDVwcjU3aXNxNzIwOGJiMnM2czkxeGxmb24xNmY4NHlzZ2llcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2lbhL8dSGMh8I/giphy.gif";
const gif2 = 'https://media.giphy.com/media/26DN0U3SqKDG2fTFe/giphy.gif?cid=790b7611m55mxjmw28bo2hqi7n0kjn0wvscs5y1w2chicje6&ep=v1_gifs_search&rid=giphy.gif&ct=g';
const gif3 = 'https://media.giphy.com/media/kHlZwlLRAIL4fk9Dga/giphy.gif?cid=ecf05e47ed4dt66kb3zzf38bg25isdx1srn35yz18a060t16&ep=v1_gifs_related&rid=giphy.gif&ct=g';
const gif4 = 'https://media.giphy.com/media/l3q2Q8YXda7uV9M40/giphy.gif?cid=ecf05e47xxdgnoj8jwkshjm0kdien5ab9pha933ro9vds5uq&ep=v1_gifs_related&rid=giphy.gif&ct=g'

const menuImg = document.getElementById('snake');
let imgList = [
    gif1, gif2, gif3, gif4
];
menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];

function settings() {
    if (settingsScreen.style.display === "none" || settingsScreen.style.display === "") {
        settingsScreen.style.display = "flex";
    } else {
        settingsScreen.style.display = "none";
    }
}
    
function stats() {
    if (statScreen.style.display === "none" || statScreen.style.display === "") {
        statScreen.style.display = "flex";
    } else {
        statScreen.style.display = "none";
    }
}


appleTexture.onload = () => console.log("Apple texture loaded successfully!");
appleTexture.onerror = () => console.error("Failed to load apple texture. Check the path!");

playerTexture.onload = () => console.log("Snake skin texture loaded successfully!");
playerTexture.onerror = () => console.error("Failed to load snake skin texture. Check the path!");



// Loads initial gif/image shown in the menu at start.
//menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];

function gameOver() {
    effectsHandler(1, 0.5)

    //visuals:
    
    menuContainer.style.display = 'flex';
    settingsScreen.style.display = 'none';
    statScreen.style.display = 'none';

    playScreenText.textContent = "You Lost!";

    canvas.classList.add('shake');
    playScreen.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 500);
    setTimeout(() => playScreen.classList.remove('shake'), 500);
    
    menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];
    
    
    //changing game state:
    gameHasEnded = true;
}

// Restarting the game by resetting values to default & running update loop.
function restart() {
    console.log("----- RESTART -----");
    
    gameHasEnded = false;
    keyIsPressed = false;
    player.x = 80;
    player.y = 80;
    player.trail = 3;
    oldXPos = [player.x];
    oldYPos = [player.y];
    console.log(playScreen);

    menuContainer.style.display = 'none';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentDirection = null;
    timeToUpdate = 100;

    generateItems(); // Generate a new item position
    drawGrid(); // Redraw the grid
    drawPlayer(); // Redraw the player
    update(); // Restart game loop

    console.log("restarting game");
    
}



