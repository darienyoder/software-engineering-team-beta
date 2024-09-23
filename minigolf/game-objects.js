
function Sandtrap(posX, posY, width, height)
{
    let sandtrap = new Sprite(posX, posY, width, height);
    sandtrap.layer = 1;
    sandtrap.collider = 'kinematic';
    sandtrap.color = 'tan';
    sandtrap.stroke = 'black';
    return sandtrap;
}

// Create tubes
function Tubes()
{
    let tubeA = new Sprite(45, 45);
    tubeA.diameter = 40;
    tubeA.collider = 'kinematic';
    tubeA.layer = 1;
    tubeA.color = 'purple'
    let tubeB = new Sprite(400, 45, 50, 50);
    tubeB.collider = 'kinematic'
    tubeB.layer = 1;
    tubeB.color = 'purple'
    return [tubeA, tubeB];
}

function Windmill(posX, posY)
{
    // Create windmill
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
