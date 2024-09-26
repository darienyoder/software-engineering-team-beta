
function Ball(x, y)
{ 
    let newBall = new Sprite(x, y);
    newBall.diameter = 20;
    newBall.color = "#ffffff";
    newBall.layer = 2;
    newBall.drag = friction;
    return newBall;
}

function Hole(x, y)
{
    let newHole = new Sprite(x, y);
    newHole.diameter = 40;
    newHole.collider = 'kinematic';
    newHole.layer = 1;
    newHole.color = 'grey';
    newHole.stroke = 'black';
    return newHole;
}

function Sandtrap(posX, posY, width, height)
{
    let sandtrap = new Sprite(posX, posY, width, height);
    sandtrap.layer = 1;
    sandtrap.collider = 'kinematic';
    sandtrap.color = 'tan';
    sandtrap.stroke = 'black';
    return sandtrap;
}

function Tubes(tubeaX, tubeaY, tubebX, tubebY)
{
    let tubeA = new Sprite(tubeaX, tubeaY);
    tubeA.diameter = 40;
    tubeA.collider = 'kinematic';
    tubeA.layer = 1;
    tubeA.color = 'purple'
    let tubeB = new Sprite(tubebX, tubebY, 50, 50);
    tubeB.collider = 'kinematic'
    tubeB.layer = 1;
    tubeB.color = 'purple'
    return [tubeA, tubeB];
}

function Windmill(posX, posY)
{
    windmillBody = new Sprite([[posX, posY], [posX - 25, posY + 75], [posX + 25, posY + 75], [posX, posY]],'s');
    windmillBody.color = 'white';
    windmillBlades = new Sprite(
        [[posX,posY], [posX-12.5, posY+75], [posX+12.5, posY+75], [posX, posY]  // Bottom
        ,[posX,posY], [posX+75, posY+12.5], [posX+75, posY-12.5], [posX, posY]  // Right
        ,[posX,posY], [posX-12.5, posY-75], [posX+12.5, posY-75], [posX, posY]  // Top
        ,[posX,posY], [posX-75, posY+12.5], [posX-75, posY-12.5], [posX, posY]] // Left
        );
    windmillBlades.color = "#52f8ff";
    windmillBlades.collider = 'kinematic';
}
