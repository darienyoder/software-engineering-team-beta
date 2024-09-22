const strokeForce = 100; // The speed of the ball when it is hit
const friction = 0.5; // The rate at which the ball slows
const maxPullBackDistance = 100; // The maximum distance to pull back

var strokeCount = 0;

var level; // The level object; builds the stage

var ball; // The player's golf ball
var canMove = true; // Whether the player can control the ball

var hole; // The goal

var ballInGoal = false;

var pullStart = null; // The starting position of the pull-back

var message = '';
var messageTime = 0;

// Runs once when the program starts
function setup()
{
    // Initialize canvas
    createCanvas();

    // Create the level layout using "level-generation.js"
    level = buildLevel(500, 300, createVector(100, 150), createVector(400, 150));

}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
async function draw()
{
    // Erase what was drawn the last frame
    clear();

    // Beige background for the canvas
    background("#f2ece3");

    // Draw the stage using "level-generation.js"
    drawStage();

    // Draw the stroke counter
    drawStrokeCount();

    // When mouse is pressed...
    if (mouse.presses() && canMove) {
        // Record the start position of the pull-back
        pullStart = createVector(mouseX, mouseY);
    }


    // When mouse is released...
    if (mouse.releases() && canMove && pullStart) {
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
        await sleep(4*forceMagnitude);
        putter.moveTo(ball.x, ball.y, .04*forceMagnitude);
        await sleep(4*forceMagnitude);

        // Apply the calculated force to the ball if its in sand
        if (ball.overlaps(sandtrap)){
        ball.applyForce((forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y)/3);

        }
        else{
            //Apply calculated for normally
        ball.applyForce(forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y);
        }

        // Hide the putter
        putter.visible = false;


        incrementShots();
    }

    if (pullStart)
    {
        drawTrajectory();
        drawPutter();
    }

    // Hole functionality Ball must be going slow to get in hole
    if (hole.overlaps(ball) &&ball.vel.x<=1.5 &&ball.vel.y<=1.5)
    {
        ballInGoal = true;
        canMove = false;
        ball.moveTo(hole.position.x, hole.position.y);
        await sleep(3000);
        

        // Can replace this with like nextlevel() or some shit when we get there
        ball.remove();
    }

    if (sandtrap.overlaps(ball))
    {
        ball.vel.x = ball.vel.x / 3;
        ball.vel.y = ball.vel.y / 3;
    }

    if (tubeA.overlaps(ball) &&ball.vel.x<=1.5 &&ball.vel.y<=1.5) {
        ball.x = tubeB.x;
        ball.y = tubeB.y;
    }

    if (tubeB.overlaps(ball)){
        ball.vel.x = .25;
        ball.vel.y = .75;
    }

    ball.overlaps(windmillBody);
    windmillBlades.rotateTo(10);
    windmillBlades.rotateTo(180);

    // Make sure windmillBlades can't interact with anything but the ball
    windmillBlades.overlaps(windmillBody)
    windmillBlades.overlaps(topWall)
    windmillBlades.overlaps(bottomWall)
    windmillBlades.overlaps(leftWall)
    windmillBlades.overlaps(rightWall)
    windmillBlades.overlaps(hole)
    windmillBlades.overlaps(sandtrap)
    windmillBlades.overlaps(tubeA)
    windmillBlades.overlaps(tubeB)

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
    stroke('red'); // Can be any color
    strokeWeight(5);
    line(screenStart.x, screenStart.y, screenStart.x + pullVector.x, screenStart.y + pullVector.y);
    pop(); // Remove style
}

function drawMessage() {
    fill(0); //Setting text color
    textSize(24); //Setting text size
    textAlign(CENTER, CENTER); // Centering text
    text(message, width / 2, height / 9); //Moving the up
}

function drawPutter(){
    // Draw the putter back in
    putter.moveTo(ball.x, ball.y,100);
    putter.visible = true;
    let mouseOnScreen =  levelToScreen(createVector(mouseX, mouseY));
    putter.rotateTowards(atan2(levelToScreen(pullStart).y - mouseOnScreen.y, levelToScreen(pullStart).x - mouseOnScreen.x), .3);
}