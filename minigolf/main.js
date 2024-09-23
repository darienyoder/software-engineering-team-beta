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

    let levelData = {
        ballPosition: [50, 75],
        holePosition: [250, 75],
        area: `

            // Left side;
            ADD rect 0, 0, 150, 150;

            // Right side;
            {
                ADD rect 350, 0, 150, 250;
                SUB {
                    ADD circle 390, 165, 40;
                    ADD rect 350, 125, 40, 200;
                    ADD rect 390, 165, 40, 200;
                }
            }
            // Top arc;
            {
                ADD circle 250, 75, 150;
                SUB circle 250, 75, 100;
                SUB rect 0, 150, 500, 300;
                SUB rect 150, 75, 300, 300;
            }

            // Path to end;
            {
                ADD rect 0, 200, 150, 50;
                ADD oval 150, 150, 125, 100;
                SUB oval 150, 150, 75, 50;
                SUB rect 0, 0, 150, 200;
                SUB rect 0, 0, 225, 150;
            }

            // End goal;
            ADD circle 250, 75, 50;
            ADD rect 225, 75, 50, 75;

        `,
    }


    level = buildLevel(levelData);


    sandtrap = Sandtrap(250, -50);
    let tubes = Tubes(465, 215, 25, 225);
    tubeA = tubes[0];
    tubeB = tubes[1];
    Windmill(450, 50);


    // Creating the putter head
    putter = new Sprite(-1000, -1000, 10, 30, 'n');
    putter.layer = 1;
    putter.color = 130,130,130;
    putter.stroke = 'black';
    //putter.debug = true;
    putter.offset.x = -20;

}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
async function draw()
{
    // Erase what was drawn the last frame
    clear();

    // Beige background for the canvas
    background(backgroundColor);

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
        // ^^ why is the modifier 5/6 ?
        await sleep(2 * forceMagnitude); //Sorry, the slow putt speed was bothering me
        putter.moveTo(ball.x, ball.y, .04*forceMagnitude);
        await sleep(2*forceMagnitude);

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


        if (pullDistance > 0) {
            incrementShots();
            // Just clicking does not increment shots anymore
        }
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
    // windmillBlades.overlaps(topWall) // These walls were placeholders and no longer exist
    // windmillBlades.overlaps(bottomWall)
    // windmillBlades.overlaps(leftWall)
    // windmillBlades.overlaps(rightWall)
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
    text(message, width / 2, height / 9 * 2.5); //Moving the up
}

function drawPutter(){
    // Draw the putter back in
    putter.moveTo(ball.x, ball.y,100);
    putter.visible = true;
    let mouseOnScreen =  levelToScreen(createVector(mouseX, mouseY));
    putter.rotateTowards(atan2(levelToScreen(pullStart).y - mouseOnScreen.y, levelToScreen(pullStart).x - mouseOnScreen.x), .3);
}
