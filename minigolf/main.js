const strokeForce = 100; // The speed of the ball when it is hit
const friction = 0.5; // The rate at which the ball slows

var ball; // The player's golf ball
var canMove = true; // Whether the player can control the ball

var hole; // The goal

// Runs once when the program starts
function setup()
{
    // Initialize canvas
    createCanvas();

    // Create golf ball in the center of the screen
    ball = new Sprite(window.innerWidth / 2, window.innerHeight / 2);
    ball.diameter = 20;
    ball.color = "#ffffff";
    ball.layer = 2;
    ball.drag = friction;

    // Create hole
    hole = new Sprite(window.innerWidth / 2, 50);
    hole.diameter = 40;
    hole.collider = 'kinematic';
    hole.layer = 1;
    hole.color = 'grey';
    hole.stroke = 'black';


}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
async function draw()
{
    // Erase what was drawn the last frame
    clear();

    // Green background for the canvas
    background("#408040");

    // When mouse is clicked...
    if (mouse.presses() && canMove)
    {
        // Accelerate ball toward the mouse at a speed of "strokeForce"
        ball.bearing = createVector(1, 0).angleBetween(createVector(mouse.canvasPos.x, mouse.canvasPos.y).sub(ball.pos));
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

// Use "await sleep(milliseconds);" to delay the code's execution
function sleep(milliseconds)
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
