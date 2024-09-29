
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
    newHole.stroke = 'yellow';
    return newHole;
}

function Sandtrap(posX, posY, width, height)
{
    let sandtrap = new Sprite(posX, posY, width, height);
    sandtrap.layer = 1;
    sandtrap.collider = 'kinematic';
    sandtrap.color = 'tan';
    sandtrap.stroke = 'tan';
    return sandtrap;
}

function Tubes(tubeaX, tubeaY, tubebX, tubebY)
{
    let tubeA = new Sprite(tubeaX, tubeaY);
    tubeA.diameter = 40;
    tubeA.collider = 'kinematic';
    tubeA.layer = 1;
    tubeA.color = '#4f2956';
    tubeA.stroke = '#4f2956';

    let tubeB = new Sprite(tubebX, tubebY, 50, 50);
    tubeB.collider = 'kinematic';
    tubeB.layer = 1;
    tubeB.color = '#4f2956';
    tubeB.stroke = '#4f2956';
    return [tubeA, tubeB];
}

function Windmill(posX, posY)
{
    windmillBody = new Sprite([[posX, posY], [posX - 25, posY + 75], [posX + 25, posY + 75], [posX, posY]],'s');
    windmillBody.color = 'white';
    windmillBody.stroke = 'white';
    windmillBody.layer = 0;

    // windmillBlades = new Sprite(
    //     [[posX,posY], [posX-12.5, posY+75], [posX+12.5, posY+75], [posX, posY]  // Bottom
    //     ,[posX+75, posY+12.5], [posX+75, posY-12.5], [posX, posY]  // Right
    //     ,[posX-12.5, posY-75], [posX+12.5, posY-75], [posX, posY]  // Top
    //     ,[posX-75, posY+12.5], [posX-75, posY-12.5], [posX, posY]] // Left
    //     );
    // windmillBlades.color = 'black';
    // windmillBlades.collider = 'kinematic';
    // windmillBlade3 = new Sprite([[posX,posY], [posX-12.5, posY-75], [posX+12.5, posY-75], [posX, posY]]);
    // windmillBlade4 = new Sprite([[posX,posY], [posX-75, posY+12.5], [posX-75, posY-12.5], [posX, posY]]);

    // Doing the blades all at once caused them to not get filled in (p5play doesn't like concave shapes).
    // If they weren't filled in, they could capture and drag the ball, especially during tests.
    // Therefore, I'm doing all 4 blades separately
    // Bottom blade
    windmillBlade1 = new Sprite([[posX,posY], [posX-12.5, posY+75], [posX+12.5, posY+75], [posX, posY]]);
    windmillBlade1.y= posY;
    windmillBlade1.offset.y = 50;
    windmillBlade1.color = 'black';
    windmillBlade1.collider = 'kinematic';

    // Right blade
    windmillBlade2 = new Sprite([[posX,posY], [posX+75, posY+12.5], [posX+75, posY-12.5], [posX, posY]]);
    windmillBlade2.x= posX;
    windmillBlade2.offset.x = 50;
    windmillBlade2.color = 'black';
    windmillBlade2.collider = 'kinematic';

    // Top Blade
    windmillBlade3 = new Sprite([[posX,posY], [posX-12.5, posY-75], [posX+12.5, posY-75], [posX, posY]]);
    windmillBlade3.y= posY;
    windmillBlade3.offset.y = -50;
    windmillBlade3.color = 'black';
    windmillBlade3.collider = 'kinematic';

    // Left Blade
    windmillBlade4 = new Sprite([[posX,posY], [posX-75, posY+12.5], [posX-75, posY-12.5], [posX, posY]]);
    windmillBlade4.x= posX;
    windmillBlade4.offset.x = -50;
    windmillBlade4.color = 'black';
    windmillBlade4.collider = 'kinematic';
}

function Water(posX, posY, shape) {
    
    if (shape == 'square'){
        water = new Sprite(posX, posY, 75, 75);
    }
    else{
        water = new Sprite(posX, posY);
        water.diameter = 75;
    }
    water.layer = 0;
    water.collider = 'kinematic';
    water.color = '#00008B';
    water.stroke = '#00008B';
    return water;
}

// Volcano sets ball to beginning
// May be fun to have it generate "lava" objects
function Volcano(posX, posY) {
    volcano = new Sprite([[posX, posY], [posX - 50, posY + 75], [posX + 50, posY + 75], [posX, posY]],'s');
    volcano.color = '#8B4513';
    volcano.stroke = '#8B0000';
    volcano.layer = 0;
    volcano.collider = 'kinematic';
    return volcano;
}
