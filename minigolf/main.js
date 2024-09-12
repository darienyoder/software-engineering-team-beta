const strokeForce = 10; // The speed of the ball when it is hit
const friction = 0.01; // The rate at which the ball slows

var ball; // The player's golf ball

// Runs once when the program starts
function setup()
{
    // Initialize canvas
    createCanvas();

    // Create golf ball in the center of the screen
    ball = new Sprite(window.innerWidth / 2, window.innerHeight / 2, 20);
    ball.color = "#ffffff";
}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
function draw()
{
    // Erase what was drawn the last frame
    clear();

    // Green background for the canvas
    background("#408040");

    // When mouse is clicked...
    if (mouse.presses())
    {
        // Accelerate ball toward the mouse at a speed of "strokeForce"
        ball.vel = ( createVector(mouse.canvasPos.x, mouse.canvasPos.y).sub(ball.pos) ).normalize().mult(strokeForce);
    }

    // Slow the ball at a rate of "friction"
    ball.vel = ball.vel.limit(Math.max(0, ball.vel.mag() - friction * deltaTime));
}
