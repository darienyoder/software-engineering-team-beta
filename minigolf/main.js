const strokeForce = 100; // The speed of the ball when it is hit
const friction = 0.5, slowFriction = 2, frictionTrigger = 0.2; // The rate at which the ball slows
const maxPullBackDistance = 100; // The maximum distance to pull back

var gameObjects = [], strokeCounts = []; strokeCount = 0;
var level = new Level(); // The level object; builds the stage
var ball, hole; // The player's golf ball and the hole
var canMove = true, ballInGoal = false, pullStart = null; // Starter variables
var message = '', messageTime = 0;

var gameState = 'menu';
var fullGameMode = true;

cameraModeOptions = ["Center"] // Options that camera mode can take-- should be same as index.html's first camera option
var cameraMode = cameraModeOptions[0];  // Current camera mode, starts at center

let trajectoryColor = 'red'; // Default trajectory color
const trajectoryColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']; // Colors to cycle through
let currentColorIndex = 0;

//variables for ball velocity from previous frame; used in wall physics calculations
let prevVelX = 0;
let prevVelY = 0;

// Sound variables
// let hitSound, holeSound, waterSplash;

// Loading sound files
// function preload(){
//     hitSound = loadSound('assets/golfPutt.wav');
//     holeSound = loadSound('assets/golfGoal.wav');
//     waterSplash = loadSound('assets/waterSplash.wav');
// }

// Runs once when the program starts
async function setup()
{
    // Initialize canvas
    createCanvas();

    document.getElementById('cameraButton').addEventListener('click', () => {

        // Change the trajectory color on click
        cameraMode = cameraModeOptions[(cameraModeOptions.indexOf(cameraMode) + 1) % cameraModeOptions.length];
        document.getElementById('cameraButton').innerText = `Camera Mode: ${cameraMode}`;

        if (gameState==='playing'){

            if(cameraMode == "Center")
            {
            // Set the camera to be at the center of the canvas
            camera.x = (level.bounds.right + level.bounds.left) / 2;
            camera.y = (level.bounds.bottom + level.bounds.top) / 2;
            }

    }
    });

    document.getElementById('colorButton').addEventListener('click', () => {
        // Change the trajectory color on click
        currentColorIndex = (currentColorIndex + 1) % trajectoryColors.length;
        trajectoryColor = trajectoryColors[currentColorIndex];
    });
}

// //Hit sound function
// function playHitSound() {
//     hitSound.play();
// }

// //Hole sound function
// function playGoalSound() {
//     holeSound.play();
// }

// //Hole sound function
// function playWaterSound() {
//     waterSplash.play();
// }

function setupLevel(levelNum) {
    // Create the level layout using "level-generation.js"
    level.load(levelNum);
  
    // Creating the putter head
    putter = new Sprite(-1000, -1000, 10, 30, 'n');
    putter.layer = 1;
    putter.color = 130,130,130;
    putter.stroke = 'black';
    //putter.debug = true;
    putter.offset.x = -20;
    // gameObjects.push(ball);

}

function startGame() {
    fullGameMode = true;
    strokeCount = 0;
    ballInGoal = false;
    canMove = true;
    setupLevel(0);
    gameState = 'playing';
}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
async function draw()
{
    // Erase what was drawn the last frame
    clear();
    background("white");

    if (gameState === 'menu') {
        drawMainMenu();
    } else if (gameState === 'levelSelect') {
        handleLevelSelect();
    }
    else if (gameState === 'playing') {
        // Draw the stage using "level-generation.js"
        level.drawStage();
        handleGamePlay();
    } else if (gameState === 'gameOver') {
        // clearGameObjects(); // Clear objects before showing game over
        drawGameOver();
    }
}

function drawMainMenu() {
    // Draw the main menu background
    fill(255); // White background for contrast
    rect(0, 0, width, height); // Optional: clear background

    fill(0); // Set text color to black
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Golf Game", width / 2, height / 4);

    textSize(24);
    text("Press 'Enter' to Start", width / 2, height / 2);
    text("Press 'z' for Level Select", width / 2, height / 1.7);

    // Draw the background rectangle for the color visualization
    fill(floorColor); // Set rectangle color to #408040
    rect(width / 4, height * 2 / 3, width / 2, 130); // Rectangle behind the text

    // Set text color to the current trajectory color
    fill(trajectoryColor);
    textSize(18);
    text("Current Trajectory color: \n" + trajectoryColor, width / 2, (height * 2 / 3)+56);

    fill(0);
}

function levelSelect() {
    gameState = 'levelSelect';
}

function levelSquare(x, y, size, levelNum) {
    fill(color(255, 0, 0));
    let lvlSqr = square(x, y, size);
    textSize(size/1.5);
    fill(0);
    text(levelNum, x + size/2, y + size/2); //puts level number in square

    //if square is clicked
    if (mouse.pressed() && mouse.x > x && mouse.x < (x+size) && mouse.y > y && mouse.y < (y+size)) {
        playLevel(levelNum - 1);
    }
    return lvlSqr;
}

function playLevel(levelNum) {
    strokeCount = 0;
    ballInGoal = false;
    canMove = true;
    setupLevel(levelNum);
    fullGameMode = false; //prevents it from going to next level
    gameState = 'playing';
}

function handleLevelSelect() {
    var squaresPerRow = 10;
    //based on width of screen, picks square size so they will be evenly spaced
    var squareSize = width / ((squaresPerRow * 3 + 1) / 2);
    var horizontalOffset = squareSize/2;
    var verticalOffset = squareSize/2;
    let lvlSqr = [];

    for (var levelNum = 0; levelNum < levelData.length; levelNum++) { //make level squares for however many levels currently exist
        var x = horizontalOffset + (levelNum % squaresPerRow) * (horizontalOffset + squareSize); //spaces squares out from walls and each other
        var y = verticalOffset + floor(levelNum/squaresPerRow) * (verticalOffset + squareSize); //for if there are multiple rows
        lvlSqr[levelNum] = levelSquare(x, y, squareSize, levelNum + 1);
    }

}



// function clearGameObjects() {
//     clear();
//
//     for (var obj of gameObjects)
//         obj.remove();
//
//     // for (var wall of walls)
//     //     wall.remove();
//
//     // background(backgroundColor);
// }

function drawGameOver() {
    background("white");
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 4);
    textSize(24);
    var totalStrokes = 0;
    for (var strokes of strokeCounts)
        totalStrokes += strokes;
    text(`Strokes: ${totalStrokes}`, width / 2, height / 2);
    text("Press 'R' to Restart", width / 2, height / 1.5);
}

function keyPressed() {
    if (gameState === 'menu' && key === 'Enter') {
        startGame();

        //Need this for camera to work
        if (cameraModeOptions.length<=1){
            cameraModeOptions.push("Follow");
        }

    } else if (gameState === 'menu' && (key === 'z' || key === 'Z')) {
        levelSelect();
    } else if (gameState === 'playing' && key === '`') {
        // Tilde runs tests
        runTests();
    } else if (gameState === 'gameOver' && (key === 'R' || key === 'r')) {
        startGame();
    }

}

async function handleGamePlay() {

    // Behavior for all GameObjects, *including* the ball and hole
    // To add or change behavior, go to game-objects.js
    for (var object of gameObjects)
        object.update();


    // Sets ball position when camera is follow
    if (cameraMode === "Follow") {
        // Make camera follow the ball's position
        camera.x = ball.x;
        camera.y = ball.y;
    }

    // Draw the stroke counter
    drawStrokeCount();

    // When mouse is pressed...
    if (mouse.presses() && canMove) {
        // Record the start position of the pull-back
        lastHit = createVector(ball.x, ball.y);
        pullStart = createVector(mouseX, mouseY);
    }

    var trueVel = sqrt((ball.velocity.x * ball.velocity.x) + (ball.velocity.y * ball.velocity.y));

    if (trueVel > 0) {
        if (trueVel <= frictionTrigger && trueVel != 0) {
            ball.drag = slowFriction;
        }
    } else {
        ball.drag = friction;
    }


    // When mouse is released...
    if (mouse.releases() && canMove && pullStart) {
        // playHitSound(); //Playing the ball hit sound
        // Calculate the pull vector and force
        let pullEnd = createVector(mouseX, mouseY);
        let pullVector = pullStart.sub(pullEnd);
        let pullDistance = constrain(pullVector.mag(), 0, maxPullBackDistance);
        let forceMagnitude = (pullDistance / maxPullBackDistance) * strokeForce;
        let forceDirection = pullVector.normalize();

        // Reset the pullStart
        pullStart = null;

        // Swinging the putter
        putter.moveTo(ball.x - (5*(forceMagnitude/6))*forceDirection.x , ball.y - (5*(forceMagnitude/6))*forceDirection.y, .04*forceMagnitude);
        // ^^ why is the modifier 5/6 ?
        await sleep(2 * forceMagnitude); //Sorry, the slow putt speed was bothering me
        putter.moveTo(ball.x, ball.y, .04*forceMagnitude);
        await sleep(2*forceMagnitude);

        // Apply the calculated force to the ball if its in sand
        // if (ball.overlaps(sandtrap)){
        //     ball.applyForce((forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y)/3);
        // }
        // else{
            //Apply calculated for normally
            ball.applyForce(forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y);
        // }

        // Hide the putter
        putter.visible = false;

        if (pullDistance > 0) {
            incrementShots();
            // Just clicking does not increment shots anymore
        }
    }

    if (pullStart)
    {
        drawTrajectory();
        drawUserAssistance();
        drawPutter();
    }

    // Iterate through each wall in the level
    for (var wall of level.walls)
    {
        // Check if the ball and the wall have collided
        if (ball.collides(wall))
        {
            let normalVector;

            // If the wall is a circle (like on rounded corners), the normal is the direction from the wall to the ball
            if (wall.width == wall.height)
            {
                normalVector = createVector(ball.x, ball.y).sub(createVector(wall.x, wall.y)).normalized();
            }
            // If the wall is a segment, the normal is the rotation of the sprite +/- 90 degrees
            // There is a normal vector for each side of the wall, so calculate each vector's distance to the ball and use whichever is closest
            else
            {
                let positiveNormalVector = p5.Vector.fromAngle(wall.rotation + 90);
                let negativeNormalVector = p5.Vector.fromAngle(wall.rotation - 90);

                if (ball.distanceTo(createVector(wall.x, wall.y) + positiveNormalVector) < ball.distanceTo(createVector(wall.x, wall.y) + negativeNormalVector))
                {
                    normalVector = positiveNormalVector;
                }
                else
                {
                    normalVector = negativeNormalVector;
                }
            }

            //Calculate new ball velocity manually
            let velocityVector = createVector(prevVelX, prevVelY);
            velocityVector.reflect(normalVector);
            ball.vel.x = velocityVector.x;
            ball.vel.y = velocityVector.y;

            break;
        }
    }

    //Store velocity from current frame for next frame's velocity calculations
    //This avoids p5play applying it's own physics to the wall bounce before I apply mine
    prevVelX = ball.vel.x;
    prevVelY = ball.vel.y;

    // Hole functionality Ball must be going slow to get in hole
    if (hole.overlaps(ball) &&ball.vel.x<=1.5 &&ball.vel.y<=1.5)
    {
        ballInGoal = true;
        // playGoalSound();
        canMove = false;
        ball.moveTo(hole.position.x, hole.position.y);
        strokeCounts.push(strokeCount);
        strokeCount = 0;
        await sleep(3000);

        if (fullGameMode) {
            level.nextLevel();
            ballInGoal = false;
            canMove = true;
        }
        else { //if in single level mode

            //clear everything
            clearGameObjects();
            for (var wall of level.walls)
            {
                wall.remove();
            }

            gameState = 'menu'; //return to menu
        }
    }

    //Ball has to be stopped in order to move
    if(!ballInGoal){
        if (ball.vel.x==0 && ball.vel.y==0){
            canMove=true //Player can take the next shot
            if(!message) {
            message = "Take Your Shot"; //Set the message
            messageTime = millis(); //Record when message was displayed
            }
        }
        else{
            canMove=false
        }

        if(message){
            drawMessage(); //Display message
        }

        if(millis() - messageTime >= 3000){ //Clear the message
            message = ''; //Reset the message
        }
    }
    //ball.debug = mouse.pressing()
}

// Converts level coordinates to screen coordinates
// Use this if you need to draw on the screen without using sprites
function levelToScreen(vector)
{
    let adjustedX = (vector.x - camera.position.x) * camera.zoom + width / 2;
    let adjustedY = (vector.y - camera.position.y) * camera.zoom + height / 2;
    return createVector(adjustedX, adjustedY);
}

// Use "await sleep(milliseconds);" to delay the code's execution
function sleep(milliseconds)
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function drawStrokeCount()
{
    fill(0); // Set text color to black
    textSize(20); // Set text size
    textAlign(RIGHT, TOP); // Align text to the top-right corner
    text(`Strokes: ${strokeCount}`, width - 20, 20); // Draw the stroke count
}

function incrementShots()
{
    strokeCount++;
}

function drawTrajectory() {
    if (pullStart === null) return; // No trajectory to draw if no pullStart is set

    // Ball's current position as the start position
    let startX = ball.position.x;
    let startY = ball.position.y;

    // Convert ball position to screen coordinates
    let screenStart = levelToScreen(createVector(startX, startY));

    // Convert pullStart to screen coordinates
    let screenPullStart = levelToScreen(pullStart);

    // Convert current mouse position to screen coordinates
    let screenMousePos = levelToScreen(createVector(mouseX, mouseY));

    // Calculate the pull vector from pullStart to mouse position
    let pullVector = createVector(screenPullStart.x-screenMousePos.x, screenPullStart.y-screenMousePos.y);
    let pullDistance = constrain(pullVector.mag(), 0, maxPullBackDistance);
    pullVector.normalize();
    pullVector.mult(pullDistance);

    // Draw trajectory line
    push(); // Start new style for the line
    stroke(trajectoryColor); // Can be any color
    strokeWeight(5);
    line(screenStart.x, screenStart.y, screenStart.x + pullVector.x, screenStart.y + pullVector.y);
    pop(); // Remove style
}

function drawUserAssistance() {
    // Ensure pullStart is set
    if (pullStart === null) return;

    // Convert pullStart to screen coordinates
    let screenPullStart = pullStart;

    // Convert current mouse position to screen coordinates
    let screenMousePos = createVector(mouseX, mouseY);

    // Calculate the pull vector from pullStart to mouse position
    let pullVector = createVector(screenMousePos.x - screenPullStart.x, screenMousePos.y - screenPullStart.y);

    // Draw trajectory line
    push(); // Start new style for the line
    stroke('grey'); // Color for the line
    strokeWeight(5);
    // Draw line from pullStart to current mouse position
    line(screenPullStart.x, screenPullStart.y, screenPullStart.x + pullVector.x, screenPullStart.y + pullVector.y);
    pop(); // Remove style
}

function drawMessage() {
    fill(0); //Setting text color
    textSize(24); //Setting text size
    textAlign(CENTER, CENTER); // Centering text
    text(message, width / 2, height / 9 * 2.5); //Moving the up
}

function drawPutter(){
    // Draw the putter back in
    putter.moveTo(ball.x, ball.y,100);
    putter.visible = true;
    let mouseOnScreen =  levelToScreen(createVector(mouseX, mouseY));
    putter.rotateTowards(atan2(levelToScreen(pullStart).y - mouseOnScreen.y, levelToScreen(pullStart).x - mouseOnScreen.x), .3);
}
