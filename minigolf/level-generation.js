const levelMargin = 50; // Number of pixels between the level's edge and the edge of the window
const wallThickness = 7; // Width of the outer walls

function buildLevel(levelWidth, levelHeight, ballPosition, holePosition)
{

    // Create bounding rectangle colliders
    let topWall = new Sprite(levelWidth / 2, 0, levelWidth + wallThickness, wallThickness);
    topWall.color = "#684917";
    topWall.stroke = "#684917";
    topWall.collider = "static";
    let bottomWall = new Sprite(levelWidth / 2, levelHeight, levelWidth + wallThickness, wallThickness);
    bottomWall.color = "#684917";
    bottomWall.stroke = "#684917";
    bottomWall.collider = "static";
    let leftWall = new Sprite(0, levelHeight / 2, wallThickness, levelHeight);
    leftWall.color = "#684917";
    leftWall.stroke = "#684917";
    leftWall.collider = "static";
    let rightWall = new Sprite(levelWidth, levelHeight / 2, wallThickness, levelHeight);
    rightWall.color = "#684917";
    rightWall.stroke = "#684917";
    rightWall.collider = "static";

    // Position camera to center bounding rectangle
    camera.x = levelWidth / 2;
    camera.y = levelHeight / 2;
    camera.zoom = Math.min(((window.innerWidth - levelMargin) / levelWidth), ((window.innerHeight - levelMargin) / levelHeight))

    // Create golf ball at "ballPosition"
    ball = new Sprite(ballPosition.x, ballPosition.y);
    ball.diameter = 20;
    ball.color = "#ffffff";
    ball.layer = 2;
    ball.drag = friction;

    // Create hole at "holePosition"
    hole = new Sprite(holePosition.x, holePosition.y);
    hole.diameter = 40;
    hole.collider = 'kinematic';
    hole.layer = 1;
    hole.color = 'grey';
    hole.stroke = 'black';


    //Creating a sandtrap
    sandtrap = new Sprite(150, 250, 100, 70); 
    sandtrap.layer = 1;
    sandtrap.collider = 'kinematic';
    sandtrap.color = 'tan';
    sandtrap.stroke = 'black';

    // For now I'm storing the level data as an array.
    // In the future it should be its own object.
    return [createVector(levelWidth, levelHeight)];
}

// Draws the stage
function drawStage()
{
    fill("#000000"); // Black outline around the stage
    rect(levelToScreen(createVector(-5, -5)).x, levelToScreen(createVector(-5, -5)).y, (level[0].x + 10) * camera.zoom, (level[0].y + 10) * camera.zoom);

    fill("#408040"); // Green floor
    rect(levelToScreen(createVector(5, 5)).x, levelToScreen(createVector(5, 5)).y, (level[0].x - 10) * camera.zoom, (level[0].y - 10) * camera.zoom);

}
