const strokeForce = 100; // The speed of the ball when it is hit
const friction = 0.5; // The rate at which the ball slows

var level; // The level object; builds the stage

var ball; // The player's golf ball
var canMove = true; // Whether the player can control the ball

var hole; // The goal

// Runs once when the program starts
function setup()
{
    // Initialize canvas
    createCanvas();

    // Create the level layout using "level-generation.js"

    let levelData = {
        ballPosition: [50, 75],
        holePosition: [450, 75],
        area: `
            ADD rect 0, 0, 500, 150;
            ADD circle 250, 75, 150;
            SUB circle 250, 75, 100;
        `,
    }

    level = buildLevel(levelData);

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

    // When mouse is clicked...
    if (mouse.presses() && canMove)
    {
        // Accelerate ball toward the mouse at a speed of "strokeForce"
        ball.bearing = createVector(1, 0).angleBetween(createVector(mouse.canvasPos.x, mouse.canvasPos.y).sub(levelToScreen(ball.pos)));
        ball.applyForce(strokeForce);
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
