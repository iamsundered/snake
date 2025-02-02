const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");

canvas.style.position = "relative";
canvas.style.display = "block";

body.appendChild(canvas);
const ctx = canvas.getContext("2d");


const statsContainer = document.getElementById("ingame-stats-container")

const scoreElement = document.getElementById("score");
let score = 0;

const deathsElement = document.getElementById('deaths');
let deaths = 0;


canvas.width = window.innerWidth; // MAKE IT SO U CAN DECIDE MAP SIZE IN SETTINGS
canvas.height = window.innerHeight;

const canvasDiv = document.createElement("div");
canvasDiv.style.display = "flex";
canvasDiv.style.justifyContent = "center";
canvasDiv.style.alignItems = "center";
canvasDiv.style.height = "100vh";
canvasDiv.style.width = "100vw";
canvasDiv.style.top = "0";
canvasDiv.style.left = "0";

canvasDiv.appendChild(canvas);
body.appendChild(canvasDiv);


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

const compact = document.getElementById("compactMap");
const normal = document.getElementById("normalMap");
const expanded = document.getElementById("expandedMap");

const compactWidth = canvas.width * 0.5;
const compactHeight = canvas.height * 0.5;

const normalWidth = canvas.width * 0.75;
const normalHeight = canvas.height * 0.75;

const expandedWidth = window.innerWidth;
const expandedHeight = window.innerHeight;

const coordsX = [];
const coordsY = [];

canvas.style.filter = "blur(7px)";

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    
    coordsX.length = 0;
    coordsY.length = 0;
    
    if (compact.checked) {
        canvas.width = compactWidth;
        canvas.height = compactHeight;
    } else if (normal.checked) {
        canvas.width = normalWidth;
        canvas.height = normalHeight;
    } else if (expanded.checked) {
        canvas.width = expandedWidth;
        canvas.height = expandedHeight;
    }
    
    
    
    // Makes sure there are only full squares and not e.g. 1/2 or 1/3 etc.
    let remainderWidth = canvas.width % 40;
    let remainderHeight = canvas.height % 40;
    
    if (remainderWidth !== 0 ) {
        canvas.width += (40 - remainderWidth)-40;
    }
    if (remainderHeight !== 0 ) {
        canvas.height += (40 - remainderHeight)-40;
    }
        
        
    for (let x = 0; x < canvas.width; x += gridSize) {
        coordsX.push(x);
        for (let y = 0; y < canvas.height; y += gridSize) {
            coordsY.push(y);
            ctx.strokeStyle = '#939393';
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
    ctx.globalAlpha = 1;
}

let itemX, itemY;

function generateItems() {
    itemX = coordsX[Math.floor(Math.random() * coordsX.length)];
    itemY = coordsY[Math.floor(Math.random() * coordsY.length)];
}

function collisionCheck(x, y) {
    if (x === player.x && y === player.y) {
        return true;
    }
}

const appleTexture = new Image();

appleTexture.src = "/snake/src/resources/assets/apple.png";

function drawItems() {
    ctx.fillStyle = "#e63535";
    ctx.drawImage(appleTexture, itemX, itemY, gridSize, gridSize); // draw the item/s

    if (collisionCheck(itemX, itemY)) { // if player touches item then:
        effectsHandler(1, 0.5);
        player.trail+=1;
        growing = true;
        score+=1;
        scoreElement.innerHTML = "<span>"+score+"<sup>⭐</sup></span>";
        generateItems();
    }
}

function movePlayer(newX, newY) {
    player.x = Math.floor(newX / gridSize)*gridSize;
    player.y = Math.floor(newY / gridSize)*gridSize;
}

// constantly updates and stores all of the snakes(player) body/tail coordinates. 
let oldXPos = [player.x];
let oldYPos = [player.y];

// Direction player goes in:
let currentDirection = null;

const bodyHorizontal = new Image();
bodyHorizontal.src = "/snake/src/resources/assets/snake/body_horizontal.png";
const bodyVertical = new Image();
bodyVertical.src = "/snake/src/resources/assets/snake/body_vertical.png";

const bodyTopRight = new Image();
bodyTopRight.src = "/snake/src/resources/assets/snake/body_topright.png";
const bodyTopLeft = new Image();
bodyTopLeft.src = "/snake/src/resources/assets/snake/body_topleft.png";

const bodyBottomRight = new Image();
bodyBottomRight.src = "/snake/src/resources/assets/snake/body_bottomright.png";
const bodyBottomLeft = new Image();
bodyBottomLeft.src = "/snake/src/resources/assets/snake/body_bottomleft.png";

const headRight = new Image();
headRight.src = "/snake/src/resources/assets/snake/head_right.png";
const headLeft = new Image();
headLeft.src = "/snake/src/resources/assets/snake/head_left.png";
const headUp = new Image();
headUp.src = "/snake/src/resources/assets/snake/head_up.png";
const headDown = new Image();
headDown.src = "/snake/src/resources/assets/snake/head_down.png";

const tailRight = new Image();
tailRight.src = "/snake/src/resources/assets/snake/tail_right.png";
const tailLeft = new Image();
tailLeft.src = "/snake/src/resources/assets/snake/tail_left.png";
const tailUp = new Image();
tailUp.src = "/snake/src/resources/assets/snake/tail_up.png";
const tailDown = new Image();
tailDown.src = "/snake/src/resources/assets/snake/tail_down.png";

let oldMovements = [];

function drawPlayer() {
    ctx.clearRect(oldXPos[0], oldYPos[0], gridSize, gridSize);
    
    for (let i = 0; i < player.trail; i++) {
        let texture = bodyHorizontal;

        // only drawing tail once every call
       if (i === 0) {
           let tailDirection = oldMovements[0]; // grabs the tails direction
           
           if (tailDirection === "d") {
               texture = tailLeft;
           } else if (tailDirection === "a") {
               texture = tailRight;
           } else if (tailDirection === "w") {
               texture = tailDown;
           } else if (tailDirection === "s") {
               texture = tailUp;
           }
       }
        
       if (i === player.trail -1) {
           let headDirection = oldMovements[oldMovements.length - 1];
           
           if (headDirection === "d") {
               texture = headRight;
           } else if (headDirection === "a") {
               texture = headLeft;
           } else if (headDirection === "w") {
               texture = headUp;
           } else if (headDirection === "s") {
               texture = headDown;
           }
       } 
        
        if (i < oldMovements.length-1) {
            let prevMove = oldMovements[i-1];
            let nextMove = oldMovements[i];

            if ((prevMove === "d" && nextMove === "d") || (prevMove === "a" && nextMove === "a")) {
                texture = bodyHorizontal;
            } else if ((prevMove === "w" && nextMove === "w") || (prevMove === "s" && nextMove === "s")) {
                texture = bodyVertical;
            } else if ((prevMove === "w" && nextMove === "d") || (prevMove === "a" && nextMove === "s")) { 
                texture = bodyBottomRight;
            } else if ((prevMove === "d" && nextMove === "s") || (prevMove === "w" && nextMove === "a")) {
                texture = bodyBottomLeft;
            } else if ((prevMove === "s" && nextMove === "d") || (prevMove === "a" && nextMove === "w")) {
                texture = bodyTopRight;
            } else if ((prevMove === "d" && nextMove === "w") || (prevMove === "s" && nextMove === "a")) {
                texture = bodyTopLeft;
            }
        }
        ctx.drawImage(texture, oldXPos[i], oldYPos[i], gridSize, gridSize);
    }

    selfTailCrashCheck();
}
let growing = false;

//clears the trail of the player depending on player.trail value.
function clearTail() {
    if (oldXPos.length > player.trail) {
        if (growing) {
            growing = false;
        }
        else {    
            oldXPos.shift();
            oldYPos.shift();
            oldMovements.shift();
        }
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
const diesAudio = new Audio("/snake/src/resources/audio/death.mp3");
const turnAudio = new Audio("/snake/src/resources/audio/move.mp3");

const effectsList = [turnAudio, diesAudio];

function effectsHandler(effect, volume) {
    effectsList[effect].play();
    effectsList[effect].volume = volume;
}

let gameHasEnded = false;
let keyIsPressed = false;



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



let startX, startY, endX, endY;
// Swipe motions:
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
})

let swipe = "";
document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    // Takes distance of start of gesture to end.
    let deltaX = Math.abs(endX - startX);
    let deltaY = Math.abs(endY - startY);
    
    console.log("swipe: " + swipe)

    // if player has 
    if (deltaX > deltaY && (deltaX > 30 || deltaY > 30)) {
        if (endX > startX) {
            swipe = 'd';
        } else {
            swipe = 'a';
        }
        effectsHandler(0, 0.2);
        keyIsPressed = true;
    } else if (deltaY > deltaX && (deltaX > 30 || deltaY > 30)){
        if (endY > startY) {
            swipe = "s";
        } else {
            swipe = "w"
        }
    }
        // Prevent reversing e.g. if going W, you cant go in S-direction
        if ((swipe === 'w' && currentDirection !== 's') ||
            (swipe === 's' && currentDirection !== 'w') ||
            (swipe === 'a' && currentDirection !== 'd') || // TODO                                            MAKE SURE TO ADD TEXTURES FOR TURNING AND SHIT
            (swipe === 'd' && currentDirection !== 'a')) {
            currentDirection = swipe;

            effectsHandler(0, 0.2);
            keyIsPressed = true;
        }
});


function update() {
    
    // if given a direction & the player hasn't crashed then move in 'currentDirection'
    if (currentDirection) {
        let x = player.x;
        let y = player.y;
        switch (currentDirection) {
            case 'w':
                y -= player.step;
                keyIsPressed = false;
                break;
            case 's':
                y += player.step;
                keyIsPressed = false;
                break;
            case 'a':
                x -= player.step;
                keyIsPressed = false;
                break;
            case 'd':
                x += player.step;
                keyIsPressed = false;
                break;
        }
        movePlayer(x, y);
        oldXPos.push(x);
        oldYPos.push(y);
        oldMovements.push(currentDirection);
        
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
    clearTail();
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
    document.body.style.backgroundRepeat = "repeat-y";
    document.body.style.opacity = "0.7";
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

// To make sure settings() & stats () knows they're hidden.

if (screen.width <= 425) {
    settingsScreen.style.display = "none";
    statScreen.style.display = "none";
}

if (screen.width <= 768 && screen.width >= 426) {
    document.getElementById('settings').addEventListener('click', function () {
        if (statScreen.style.display !== "none") { // stat menu on ->
            statScreen.style.display = "none";
            settingsScreen.style.display = "flex";
            settingsScreen.style.order = window.getComputedStyle(statScreen).order;
            statScreen.style.order = "3";
        }
    });
    document.getElementById('stats').addEventListener('click', function () {
        if (settingsScreen.style.display !== "none") {
            settingsScreen.style.display = "none";
            statScreen.style.display = "flex";
            statScreen.style.order = window.getComputedStyle(settingsScreen).order;
            settingsScreen.style.order = "1";
        }
    });
}



function menuScaling(menu) {
    // Dynamically check screen size
    if (window.matchMedia("(max-width: 425px)").matches) {
        body.style.overflowY = "scroll";
        body.style.overflowX = "hidden";
        console.log("mobile");
    } else {
        body.style.overflow = "hidden";
        console.log("desktop");
    }
    
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
        menu.style.animation = "fadeIn 0.25s forwards";
    } else {
        menu.style.animation = "fadeOut 0.25s forwards";
        setTimeout(() => { menu.style.display = "none"; }, 250);
    }
}

function settings() {
    console.log("settings");
    menuScaling(settingsScreen);
}

function stats() {
    console.log("stats");

    menuScaling(statScreen);
}


function gameOver() {
    effectsHandler(1, 0.5)

    deaths+=1;
    console.log("Deaths: ", deaths);
    deathsElement.innerHTML = "<span>"+deaths+"<sup>💀</sup></span>";
    
    
    //visuals:

    menuContainer.style.display = 'flex';

    playScreenText.textContent = "You Lost!";

    canvas.classList.add('shake');
    playScreen.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 500);
    setTimeout(() => playScreen.classList.remove('shake'), 500);

    menuImg.src = imgList[Math.floor(Math.random() * imgList.length)];
    
    canvas.style.filter = "blur(10px)";
    
    //changing game state:
    gameHasEnded = true;
}

// Restarting the game by resetting values to default & running update loop.
function restart() {
    console.log("----- RESTART -----");

    gameHasEnded = false;

    // Resetting movement
    currentDirection = null;
    swipe = "";
    keyIsPressed = false;
    oldXPos = [player.x];
    oldYPos = [player.y];
    player.x = 80;
    player.y = 80;

    player.trail = 4;
    score = 0;
    scoreElement.innerHTML = "<span>"+score+"<sup>⭐</sup></span>";
    deathsElement.innerHTML = "<span>"+deaths+"<sup>💀</sup></span>";
    statsContainer.style.display = 'flex';
    
    console.log("deaths "+deaths);
    
    oldXPos = [player.x];
    oldYPos = [player.y];
    oldMovements = [];
    console.log(playScreen);

    menuContainer.style.display = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    timeToUpdate = 100; // Resets the time

    canvas.style.filter = "none";

    drawGrid();
    generateItems();
    drawPlayer();
    update();
    player.trail+=1;
    growing = true;

    console.log("restarting game");

}



