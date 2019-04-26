var CanvasSpace;  
CanvasSpace = document.getElementById("SpaceShooterCanvas");
var canvas = CanvasSpace.getContext("2d");
var canvasWidth = 600;
var canvasHeight = 500;
var keysDown = {}; //holds object that checks for keys up and keys down
var playerBullets = []; // holds bullets in an array
var enemies = []; 
var lives = 3;
var score = 0;

//set up the frames per second you want to have the game to operate. Change this to make the game less mor more clunky 
var FramesPerSec = 60;
// var gameLoop
var everythingThatNeedsToHappen


//Set up Images
///////////////////////////////////////
///////////////////////////////////////
var backgroundReady = false;
var backgroundImage = new Image();

var playererady = false;
var playerImage = new Image();


var bulletsReady = false;
var bulletImage = new Image();

var enemyReady = false;
var enemyImage = new Image();

enemyImage.onload = function () {
    enemyReady = true;
};
enemyImage.src = "media/enemySpaceship.png"


bulletImage.onload = function () {
    bulletReady = true;
};
bulletImage.src = "media/playerBullet.png"



playerImage.onload = function () {
    playererady = true;
};

playerImage.src = "media/playerImage.png"


backgroundImage.onload = function ()
{
    backgroundReady = true
};

backgroundImage.src = "media/background.png";


//image provided by https://www.shutterstock.com/video/clip-10697474-abstract-neon-background-stars-on-black-sparkle


//add sound
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
    this.loop = function (){
        this.sound.loop = true;
    }
}

function sound1(src) {
    this.sound = document.createElement("AUDIO");
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
    this.loop = function (){
        this.sound.loop = true;
    }
    this.autoplay = function(){
        this.sound.autoplay() = true
    }
}





gameOverSound = new sound("./media/gameOver.wav")
enemyHitSound = new sound("./media/enemyHit.wav")
lifeLossSound = new sound("./media/lifeLoss.wav")
shootSound = new sound("./media/phaser.wav")
musicLoop = new sound("./media/musicLoop.wav")

// musicLoop.addEventListener("load", function(){
//     musicLoop.play();
// })

//gameOverSound.play();

//playMusicLoop();

function mainLoop() {
    //setInterval(function(){
        //musicLoop.play();
        update();
        draw();
        handleCollisions();
        lifeLoss();
    }//, 
    //1000/FramesPerSec);
//}
//keyup and down event listeners
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function update(){
    //need to keep player in bounds by listing the boundaries
    if(player.x + player.width >= canvasWidth){
        player.x = canvasWidth - player.width
    }
    if(player.x <= 0){
        player.x = 0
    }
    if(player.y + player.height >= canvasHeight){
        player.y = canvasHeight - player.height
    }
    if(player.y <= 0){
        player.y = 0
    }
    
    //FYI 37 is left, 38 is up, 39 is right, 40 is down, 32 is the spacebar
    if (38 in keysDown) {
        player.y -=4;
    }
    if (40 in  keysDown) {
    player.y +=4;
    }
    if (37 in keysDown) {
        player.x -=4;
    }
    if (39 in  keysDown) {
        player.x +=4;
    }

    if (32 in keysDown){
        if (playerBullets.length < 1){
            player.shoot();
        }
        if (playerBullets.length > 1){
            setTimeout(function(){
                player.shoot(); //do what you need here
            }, 250);
        }
    }

    playerBullets.forEach(function(bullet){
        bullet.update();
    });

    playerBullets = playerBullets.filter(function(bullet) {
        return bullet.active;
    });

    enemies.forEach(function(enemy){
        enemy.update();
    })

    if(Math.random() < 0.03) {
        enemies.push(Enemy());
    }
    
    // handleCollisions();
    // lifeLoss(lives);
    
};

//function to reset game board
var resetBoard = function(){
    player.x = 220;
    player.y = 270;
    player.active = true;

    enemies = [];
}

//function to check to see if there should be a loss of life.
var lifeLoss = function(){
    if(player.active === false){
        if(lives >=1){
            lifeLossSound.play();
            lives--;
            resetBoard();
        }
        //  else{
        //  gameOver();
        //  }
    }    
}

//code provided by 
function backgroundMove(){
    this.x = 0, this.y = 0, this.w = backgroundImage.width, this.h = backgroundImage.height;
    this.render = function (){
        canvas.drawImage(backgroundImage, 0, this.y-= 3);
        if (this.y <= -500){
            this.y = 0;
        }
    } 
}

var BackgroundMove = new backgroundMove();




function gameOver(){
    clearInterval(interval)
    if (confirm("GAME OVER!! Do you want to play again?")){
        location.reload();
    }
    else {
        window.history.back();
    }
}

function draw(){
    canvas.clearRect(0,0, canvasWidth, canvasHeight);
    //canvas.drawImage(backgroundImage,0,0);
    BackgroundMove.render()
    scoreBoard();
    player.draw();
    playerBullets.forEach(function(bullet){
        bullet.draw();
    });

    enemies.forEach(function(enemy){
        enemy.draw();
    });
};

var player = {
    color: "#00A",
    x:220,
    y:270,
    width:50,
    height: 70,
    draw: function(){
        canvas.drawImage(playerImage, this.x, this.y);
        //canvas.fillRect(this.x, this.y, this.width, this.height);
    },
    explode: function(){
        this.active = false;
        //add explosion graphic here.
    },
    active: true
};


function scoreBoard(){
    canvas.fillStyle = "rgb(250, 250, 250)";
    canvas.font = "15px, Palatino";
    canvas.textAlign = "left";
    canvas.textBaseline = "top";
    canvas.fillText("Lives: " + lives, 36, 56);
    canvas.fillText("Score: " + score, 36, 36);
    canvas.beginPath();
    //canvas.lineWidth= 3;
    //canvas.strokeStyle = "rgb(250, 250, 250)";
    //canvas.rect(30,40, 60, 45);
    //canvas.stroke();
}



function bullet(my){
    my.active = true;

    my.xVelocity = 0;
    my.yVelocity = -my.speed * 3;
    my.width = 20;
    my.height = 20;
    //my.color = "#000";
    
    my.inBounds = function() {
        return my.x >= 0 && my.x <=canvasWidth && my.y >= 0 && my.y < canvasHeight 
    };

    my.draw = function(){
        canvas.drawImage(bulletImage, this.x, this.y);
        //canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    my.update = function() {
        my.x += my.xVelocity;
        my.y += my.yVelocity;

        my.active = my.active && my.inBounds();
    };

    return my;
}

player.shoot = function () {
    var bulletPosition = this.midpoint();
    
    playerBullets.push (bullet({
        speed: 5,
        x: bulletPosition.x,
        y: bulletPosition.y
    }));
};

player.midpoint = function(){
    return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
    };
};

function Enemy(my){
    my = my || {};

    my.active = true;
    my.age = Math.floor(Math.random() * 128);

    my.color= "#A2B";

    my.x = canvasWidth / 4 + Math.random() * canvasWidth / 2;
    my.y = 0;
    my.xVelocity = 0;
    my.yVelocity = 2;

    my.width = 50;
    my.height = 50;

    my.inBounds = function() {
        return my.x >= 0 && my.x <= canvasWidth && my.y >= 0 && my.y <=canvasHeight
    };

    my.draw = function() {
        canvas.drawImage(enemyImage, this.x, this.y);
        //canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    my.update = function(){
        my.x += my.xVelocity;
        my.y +=my.yVelocity;

        my.xVelocity = 3 * Math.sin(my.age * Math.PI / 64);

        my.age++;

        my.active = my.active && my.inBounds();
    };

    my.explode = function(){
        my.active = false;
        //add graphic for explosion
    }

    return my;
}


function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
 }

function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}


function handleCollisions() {
    playerBullets.forEach(function(bullet) {
      enemies.forEach(function(Enemy) {
        if (collides(bullet, Enemy)) {
        Enemy.explode();
        score += 10;
        bullet.active = false;
        Enemy.active = false;
            
        for(let i = 0; i < arrayRemove.length; i++){
            if(Enemy.active === false){
                
                enemies = arrayRemove(enemies, enemies[i])
            }
            if(bullet.active === false){
                playerBullets = arrayRemove(playerBullets, playerBullets[i])
            }  
                    
          } 
          
        }
      });
    });
  
    enemies.forEach(function(Enemy) {
        if (collides(Enemy, player)) {
            Enemy.explode();
            player.explode();
            if(player.active === false){
                if(lives >=1){
                    lives--;
                    resetBoard();
            }
              else{
              gameOver();
              }
      }
        }
    })
}
  
var interval = setInterval(mainLoop, 1000/FramesPerSec)

function explode(){
   return this.active = false
}

function runMainGame(){
if (lives > 0){
    var interval = setInterval(mainLoop, 1000/FramesPerSec)   
}
else{
    clearInterval(interval)
    
}
}

//runMainGame();

