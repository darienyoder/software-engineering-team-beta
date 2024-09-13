const strokeForce = 5; // The speed of the ball when it is hit
const friction = 0.01; // The rate at which the ball slows

var ball; // The player's golf ball
var canmove=true
// Runs once when the program starts
function setup()
{
    // Initialize canvas
    createCanvas();

    // Create golf ball in the center of the screen
    ball = new Sprite(window.innerWidth / 2, window.innerHeight / 2, 20);
    ball.color = "#ffffff";
    ball.layer=2

    //Create hole
    hole = new Sprite(window.innerWidth/2,50)
    hole.diameter = 40
    hole.collider = 'k'
    hole.layer=1
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
    if (mouse.presses() && canmove)
    {
        // Accelerate ball toward the mouse at a speed of "strokeForce"
        ball.vel = ( createVector(mouse.canvasPos.x, mouse.canvasPos.y).sub(ball.pos) ).normalize().mult(strokeForce);
    }
    //Hole functionality
    if (hole.overlaps(ball)){
        canmove=false
        ball.moveTo(hole.position.x, hole.position.y)
        await sleep(3000)
        //Can replace this with like nextlevel() or some shit when we get there
        ball.remove()
    }
    
    // Slow the ball at a rate of "friction"
    ball.vel = ball.vel.limit(Math.max(0, ball.vel.mag() - friction * deltaTime));
}

//Useful for delaying shit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }