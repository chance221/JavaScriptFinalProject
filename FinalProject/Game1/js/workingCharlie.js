//First you must create the Canvas


var canvas = document.getElementById("theCanvas");
var context = canvas.getContext("2d");
document.body.appendChild(canvas);

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Add a Backgsround Image

var backgroundReady = false;
var backgroundImage = new Image();

backgroundImage.onload = function ()
{
    backgroundReady = true
};

backgroundImage.src = "../Game1/media/grassBackground.png";

//Add hero Images
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "../Game1/media/hero.png"

//Add Monster Images

var monster1Ready = false;
var monster1Image = new Image();
monster1Image.onload = function (){
    monster1Ready = true;
}
monster1Image.src = "../Game1/media/monster1.png"

//Add Charlie Image

var CharlieReady = false;
var CharlieImage = new Image();
CharlieImage.onload = function(){
    CharlieReady = true;
}
CharlieImage.src = "../Game1/media/Charlie.png"




//Insert game Objects

var hero = {
    speed: 256, //movement speed 
    x: 0,
    y: 0
}


var monster1 = {
    speed: 200,
    x:0,
    y:0
}

var Charlie = {
    speed: 245,
    x:0,
    y:0
}

var monstersCaught = 0; //variable to keep track of score

///reset heros and monsters

var resetHero = function(){
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
}

var resetMonster1 = function(){
    monster1.x = 36 + (Math.random() * (canvas.width - 64));
    monster1.y = 36 + (Math.random() * (canvas.height - 64));
}

var resetCharlie = function(){
    Charlie.x = 36 + (Math.random() * (canvas.width - 64));
    Charlie.y = 36 + (Math.random() * (canvas.height - 64));
} 

//Update game objects

var update = function (modifier) {
    if (38 in keysDown) {
        hero.y -=hero.speed * modifier;
    }
    if (40 in  keysDown) {
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) {
        hero.x -=hero.speed * modifier;
    }
    if (39 in  keysDown) {
        hero.x += hero.speed * modifier;
    }

    //need to make monsters move around HERE

    //If the hero touches the Monster or Charlie

    if (
        hero.x <= (monster1.x + 36)
        && monster1.x <= (hero.x + 36)
        && hero.y <= (monster1.y + 36)
        && monster1.y <= (hero.y + 36)
    ){
        monstersCaught += 2;
        resetMonster1();
    }

    if (
        hero.x <= (Charlie.x + 36)
        && Charlie.x <= (hero.x + 36)
        && hero.y <= (Charlie.y + 36)
        && Charlie.y <= (hero.y + 36)
    ){
        monstersCaught += 10;
        resetCharlie();
    }
}
 
// render GameBoard and game objects remember that his order is important as the items will be drawn on top of the previously rendered objects

var render = function () {
    if (backgroundReady) {
        context.drawImage (backgroundImage, 0, 0);
    }

    if (heroReady) {
        context.drawImage (heroImage, hero.x, hero.y);
    }
    if (monster1Ready) {
        context.drawImage (monster1Image, monster1.x, monster1.y);
    }

    if (CharlieReady) {
        context.drawImage (CharlieImage, Charlie.x, Charlie.y)
    }

    //Scoreboard render

    context.fillStyle = "rgb(250, 250, 250)";
    context.font = "24px Helvetica";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + monstersCaught, 36, 36)
}

// Main Game Loop
var mainLoop = function(){
    var now = Date.now();
    var timeLapsed = now - then;

    update(timeLapsed / 1000);
    render();

    then = now;
//the below function request to do this again ASAP
    requestAnimationFrame(mainLoop);
};


// For cross browser support for the requestAnimationFrame method as it is used differently in different browsers
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now;
resetHero();
resetMonster1();
resetCharlie();
mainLoop();