//starter code provided by

//First you must create the Canvas

alert("You must use directinoal buttons to Chase Charlie")
var canvas = document.getElementById("Game1Canvas");
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

//Add Game Sounds constructor provided from W3Schools.com
//Sounds provided by freesound.org
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

gotMonsterSound = new sound("../Game1/media/gotMonster1.mp3")
gameOver = new sound("../Game1/media/endGame.wav")
pickUpMonster = new sound("../Game1/media/pickUpObject.wav")


//Insert game Objects

var hero = {
    speed: 256, //movement speed 
    x: 0,
    y: 0
}


var monster1 = {
    speed: 260,
    x:0,
    y:0
}

var Charlie = {
    speed: 245,
    x:0,
    y:0
}

var monstersCaught = 0; //variable to keep track of score
var monsterSpeed = 1;
var lives = 3;
///reset heros and monsters

var resetHero = function(){
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
}

var resetMonster1 = function(){
    monster1.x = 50 + (Math.random() * (canvas.width - 64));
    monster1.y = 50 + (Math.random() * (canvas.height - 64));
}

var resetCharlie = function(){
    Charlie.x = 50 + (Math.random() * (canvas.width - 64));
    Charlie.y = 50 + (Math.random() * (canvas.height - 64));
    if (Charlie.x > 430){
        Charlie.x = 430
    } 
    if (Charlie.y > 425) {
        Charlie.y = 425
    }
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
    //sets boundaries for character
    if (hero.y < 42 ){
        hero.y = 42
    }
    if (hero.x < 36) {
        hero.x = 36
    }
    if (hero.x > 430){
        hero.x = 430
    }
    if (hero.y > 425) {
        hero.y = 425
    }

    var monsterMove = function() {
        
        if (monster1.x >= hero.x) {
            monster1.x -=monsterSpeed
        }
        if (monster1.x <= hero.x){
            monster1.x += monsterSpeed
        }
        if (monster1.y >= hero.y){
            monster1.y -=monsterSpeed
        } 
        if (monster1.y <= hero.y){
            monster1.y += monsterSpeed 
        } 
    }
    monsterMove();
    //need to make monsters move around HERE
    
    //If the hero touches the Monster or Charlie

    if (
        hero.x <= (monster1.x + 36)
        && monster1.x <= (hero.x + 36)
        && hero.y <= (monster1.y + 36)
        && monster1.y <= (hero.y + 36)
    ){
        monsterSpeed -= .5;
        lives --;
        gotMonsterSound.play();
        
        if (monsterSpeed < 1){
            monsterSpeed = 1
        }
        if (lives === 0){
            pickUpMonster.stop();
            gameOver.play();
            alert("GAME OVER");
            location.reload();
        }

        resetMonster1();
        
    
    }
    if (
        hero.x <= (Charlie.x + 36)
        && Charlie.x <= (hero.x + 36)
        && hero.y <= (Charlie.y + 36)
        && Charlie.y <= (hero.y + 36)
    ){
        pickUpMonster.stop();
        monstersCaught += 10;
        pickUpMonster.play();
        monsterSpeed +=.2;
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
    context.font = "15px, Palatino";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + monstersCaught, 36, 36);
    context.fillText("Lives: " + lives, 36, 56);
    context.beginPath();
    context.lineWidth= 5;
    context.strokeStyle = "rgb(250, 250, 250)";
    context.rect(30,30, 60, 45);
    context.stroke();
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