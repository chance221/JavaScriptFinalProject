//set up variables 
var canvas = document.getElementById("Game2Canvas");
var context = canvas.getContext("2d");
var x = canvas.width/2; //sets initial x and y position to the center 30px above bottom of canvas
var y = canvas.height-30;
var moveX = 2; //move 2 px every frame refresh. If you want the bar to move faster then increase this number but not so much that it feels clunky
var moveY = -2;
var ballRadius = 10; //when drawing a ball object need to set the radius in constructor if you want a bigger ball need to increase
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 3;

//brick definitions
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 75; //set beick width
var brickHeight = 20; //set brick height 
var brickPadding = 10; 
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// brick array
var bricks = []; // new brick array to hold the information regarding brick position
var brickX = (col*(brickWidth  + brickPadding))+brickOffsetLeft; //sets brick x position
var brickY = (row*(brickHeight + brickPadding))+brickOffsetTop; //sets brick y position

for (var col = 0; col <brickColumnCount; col++){
    bricks[col] = [];
    for (var row=0; row<brickRowCount; row++){
        bricks[col][row] = {x: 0, y: 0, status: 1 }; //constructor in for loop sets the specific brick object to initial column and row posiiton. Status will update weather or not the brick is visible and hittable
    }
}

//Add Game Sounds constructor provided from W3Schools.com automatically preloads sounds and gets rid of all visible controls
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

//creates additional variables to set the different sound effects to fire upon specified events when functions invoked.

paddleHit = new sound("./media/paddleHit.wav");
brickHit = new sound("./media/success.wav");
lifeLost = new sound("./media/lifeLost.ogg");
gameOver = new sound("./media/pongGameOver.wav");

var newPaddleSound = document.createElement("audio");
newPaddleSound.setAttribute("preload", "auto")
newPaddleSound.src = "/media/paddleHit.wav"



//send the page event listeners for both the keyboard and the mouse

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


        
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;

    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawLives() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: " + lives, canvas.width - 65, 20)
}

        
//goes through each brick to check to see if the space as been entered by the ball. 
//If contact is made then reverse the direction of the ball.
//Also includes a function that allows a "You Win alert and reloads the page"
function collisionDetection() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            var b = bricks[col][row];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    brickHit.play();
                    moveY = -moveY;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("You WIN!!!!")
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD"
    context.fillText("Score: " + score, 8, 20);
}

function drawBricks() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status == 1) {
                var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}


function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0 * Math.PI, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#eee";
    context.strokeStyle = "black"
    context.fill();
    context.stroke();
    context.closePath();

}

function popUpInstructions(){
    alert("Welcome to my Block Breaker Game!. \n\nUse the keys or the moust to move the paddle at the bottom\nof the screen to keep the ball from loosing a life")
}

//clears the canvas, then redraws them after

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    //if the ball reaches the top must reverse direction
    if ((y + moveY < ballRadius)) {
        moveY = -moveY;
        paddleHit.play();
        
    }
    //if it hits the sides it must reverse direction
    if ((x + moveX > canvas.width - ballRadius) || (x + moveX < ballRadius)) {
        moveX = -moveX;
        paddleHit.play();
        
    }
    //if it hits the paddle it must change directions
    if (y + moveY > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y = y - paddleHeight) {
                moveY = - moveY
                paddleHit.play();
            }

        } //if it hits the bottom you lose a life.
        else {
            lives--;
            if(lives>= 1){
                lifeLost.play();
                }
            if (!lives) {
                brickHit.stop();
                gameOver.play();
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval)
            }//else the paddle is still in the original position + or - any x or y coordinates sent in by event handelers
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                moveX = 2;
                moveY = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }

        }
    }
    //keeps paddle within the canvas
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += moveX;
    y += moveY;
}

popUpInstructions();
var interval = setInterval(drawObjects, 10)//this sets the gameLoop