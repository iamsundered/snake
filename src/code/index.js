const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");

canvas.style.position = "relative";
canvas.style.display = "block";

body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



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
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.strokeStyle = '#75ca29';
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
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
    console.log("WOOOOO: "+itemX, itemY);
}

function drawItems() {
    ctx.fillStyle = "#e63535";
    ctx.fillRect(itemX, itemY, gridSize, gridSize); // draw the item/s
    console.log("item is at: " + itemX + itemY);

    if (itemX === player.x && itemY === player.y) {
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

function drawPlayer() {
    ctx.fillStyle = "#13811c";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    clearTail();
    selfTailCrashCheck();
    console.log("player head is at: ", player.x, player.y);
    
}

//clears the trail of the player depending on player.trail value.
function clearTail() {
    if (oldXPos.length === player.trail || oldYPos.length === player.trail) {
        ctx.clearRect(oldXPos[0], oldYPos[0], gridSize, gridSize);
        
        oldXPos.shift();
        oldYPos.shift();
    }
}

function selfTailCrashCheck() {
    
    let newOldXPos = oldXPos.slice(0, -1);
    let newOldYPos = oldYPos.slice(0, -1);

    const combinedCoordinates = newOldXPos.map((value, index) => [value, newOldYPos[index]]);
    const currentCoordinates = [player.x, player.y];

    for (let i = 0; i < combinedCoordinates.length; i++) {
        //compares the current coordinates with each pair of old coordinates.
        if (combinedCoordinates[i][0] === currentCoordinates[0] && combinedCoordinates[i][1] === currentCoordinates[1]) {
            gameOver();
        }
    }
        
        // todo 
        //  MAKE SURE TO DRAW THE TRAIL OVER AND OVER SO IT DOESN'T GET OVER-DRAWN.
        //  ADD powerups! e.g eat fruit = grow tail, eat something else = game is faster/slower or slowmo 
        //  e.g slowmo or a bomb.
        //  add textures like snake textures and map textures.
        //  add start menu & polish game over menu.
}

//generate map values e.g 1 = items, 0 = nothing.


let gameHasEnded = false;

const topBoundary = 0;
const bottomBoundary = canvas.height;
const leftBoundary = 0;
const rightBoundary = canvas.width;

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
const diesAudio = new Audio('../resources/audio_effects/death.mp3');
const turnAudio = new Audio('../resources/audio_effects/move.mp3');

const effectsList = [turnAudio, diesAudio];

function effectsHandler(effect, volume) {

    effectsList[effect].play();
    effectsList[effect].volume = volume;
    
}


const validKeys = ['w', 'a', 's', 'd'];
let unmodifiedKey = null;

function update() {

// key is pressed:
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        // Only updates if a valid key is pressed.
        if (validKeys.includes(key)) {

            // Prevent reversing e.g. if going W, you cant go in S-direction
            if ((key === 'w' && currentDirection !== 's') ||
                (key === 's' && currentDirection !== 'w') ||
                (key === 'a' && currentDirection !== 'd') ||
                (key === 'd' && currentDirection !== 'a')) {
                currentDirection = key;

                effectsHandler(0, 0.2);
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
                break;
            case 's':
                y += player.step;
                movePlayer(x, y);
                break;
            case 'a':
                x -= player.step;
                movePlayer(x, y);
                break;
            case 'd':
                x += player.step;
                movePlayer(x, y);
                break;
        }
        oldXPos.push(x);
        oldYPos.push(y);
        //console.log(oldXPos);
        //console.log(oldYPos);
        //console.log("Current DIRECTION INSIDE UPDATE LOOP UNDER MOVEMENT CHECK: ",currentDirection);

    }

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

const losingScreen = document.getElementById('losingScreen');
const losingScreenText = document.getElementById('losingScreenText');
const menuImg = document.getElementById('snake');
/*let imgList = [
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2pvbDVwcjU3aXNxNzIwOGJiMnM2czkxeGxmb24xNmY4NHlzZ2llcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2lbhL8dSGMh8I/giphy.gif',
    'https://media.giphy.com/media/26DN0U3SqKDG2fTFe/giphy.gif?cid=790b7611m55mxjmw28bo2hqi7n0kjn0wvscs5y1w2chicje6&ep=v1_gifs_search&rid=giphy.gif&ct=g', 
    'https://media.giphy.com/media/kHlZwlLRAIL4fk9Dga/giphy.gif?cid=ecf05e47ed4dt66kb3zzf38bg25isdx1srn35yz18a060t16&ep=v1_gifs_related&rid=giphy.gif&ct=g',
    'https://media.giphy.com/media/l3q2Q8YXda7uV9M40/giphy.gif?cid=ecf05e47xxdgnoj8jwkshjm0kdien5ab9pha933ro9vds5uq&ep=v1_gifs_related&rid=giphy.gif&ct=g'
]/*

// Loads initial gif/image shown in the menu at start.
menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];*/

function gameOver() {
    effectsHandler(1, 0.5)
    
    //visuals:
    losingScreen.style.visibility = 'visible';
    canvas.classList.add('shake');
    losingScreen.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 500);
    setTimeout(() => losingScreen.classList.remove('shake'), 500);
    losingScreenText.textContent = 'Game Over!';
    
    // Randomizing the image shown in the losing screen.
    //menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];
    
    
    //changing game state:
    gameHasEnded = true;
}

// Restarting the game by resetting values to default & running update loop.
function restart() {
    generateItems();
    gameHasEnded = false;
    setTimeout(update, timeToUpdate);
    //requestAnimationFrame(update);
    player.x = 80;
    player.y = 80;
    player.trail = 3;
    oldXPos = [player.x];
    oldYPos = [player.y];
    losingScreen.style.visibility = 'hidden';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentDirection = null;
    timeToUpdate = 100;
    
    console.log("restarting game");
    
}



