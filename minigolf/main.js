const strokeForce = 100; // The speed of the ball when it is hit
const friction = 0.5; // The rate at which the ball slows
const maxPullBackDistance = 100; // The maximum distance to pull back

var level; // The level object; builds the stage

var ball; // The player's golf ball
var canMove = true; // Whether the player can control the ball

var hole; // The goal

var pullStart = null; // The starting position of the pull-back

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

    // When mouse is pressed...
    if (mouse.presses() && canMove) {
        // Record the start position of the pull-back
        pullStart = createVector(mouse.canvasPos.x, mouse.canvasPos.y);
    }

    // When mouse is released...
    if (mouse.releases() && canMove && pullStart) {
        // Calculate the pull vector and force
        let pullEnd = createVector(mouse.canvasPos.x, mouse.canvasPos.y);
        let pullVector = pullStart.sub(pullEnd);
        let pullDistance = constrain(pullVector.mag(), 0, maxPullBackDistance);
        let forceMagnitude = (pullDistance / maxPullBackDistance) * strokeForce;
        let forceDirection = pullVector.normalize();

        // Apply the calculated force to the ball
        ball.applyForce(forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y);

        // Reset the pullStart
        pullStart = null;
    }

    // Hole functionality
    if (hole.overlaps(ball))
    {
        canMove = false;
        ball.moveTo(hole.position.x, hole.position.y);
        await sleep(3000);

        // Can replace this with like nextlevel() or some shit when we get there
        ball.remove();
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
