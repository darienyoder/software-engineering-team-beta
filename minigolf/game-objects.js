var gameObjects = [];

class GameObject {

    // "type" specifies what object it is.
    // "sprites" contains every P5play sprite the object uses.
    constructor(_type = "", _sprites = []) {
        this.type = _type;
        if (Array.isArray(_sprites))
            this.sprites = _sprites;
        else
            this.sprites = [_sprites];
    }

    // Runs every frame
    update() {
        switch (this.type) {
            case "ball":

                break;

            case "hole":

                break;

            case "sandtrap":
                if (this.sprites[0].overlaps(ball))
                {
                    ball.vel.x = ball.vel.x / 3;
                    ball.vel.y = ball.vel.y / 3;
                }
                break;

            case "tubes":
                if (this.sprites[0].overlaps(ball) && ball.vel.x <= 1.5 && ball.vel.y <= 1.5)
                {
                    ball.x = this.sprites[1].x;
                    ball.y = this.sprites[1].y;
                    ball.vel.x = 3;
                    ball.vel.y = 0;
                }

                ball.overlaps(this.sprites[1]);

                break;

            case "windmill":
                ball.overlaps(this.sprites[0]);
                for (var blade of this.sprites[1])
                    blade.rotationSpeed = -1;

                break;

            case "water":

                if (this.sprites[0].overlaps(ball))
                {
                    // playWaterSound();
                    ball.vel.x = 0;
                    ball.vel.y = 0;
                    ball.x = lastHit.x;
                    ball.y = lastHit.y;
                }

                break;

            case "lava":

                if (this.sprites[0].overlaps(ball))
                {
                    ball.vel.x = 0;
                    ball.vel.y = 0;
                    ball.x = ballStart.x;
                    ball.y = ballStart.y;
                }

                break;

        }
    }

    // For each element in "sprites",
    // remove the element if it is a sprite,
    // or remove every subelement in the element
    // if it is an array of sprites.
    delete() {

        for (var sprite of this.sprites)
        {
            if (Array.isArray(sprite))
            {
                for (var subSprite of sprite)
                {
                    subSprite.remove();
                }
            }
            else
            {
                sprite.remove();
            }
        }
    }
}

function getObjectsByType(objectType)
{
    let filteredObjects = [];

    for (var object of gameObjects)
        if (object.type == objectType)
            filteredObjects.push(object);

    return filteredObjects;
}

function Ball(x, y)
{
    let newBall = new Sprite(x, y);
    newBall.diameter = 20;
    newBall.color = "#ffffff";
    newBall.layer = 2;
    newBall.drag = friction;
    newBall.image = 'assets/ball.png'
    newBall.image.scale = .025

    return new GameObject("ball", newBall);
}

function Hole(x, y)
{
    let newHole = new Sprite(x, y);
    newHole.diameter = 40;
    newHole.collider = 'kinematic';
    newHole.layer = 1;
    newHole.color = 'grey';
    newHole.stroke = 'yellow';

    return new GameObject("hole", newHole);
}

function Sandtrap(posX, posY, width, height)
{
    let sandtrap = new Sprite(posX, posY, width, height);
    sandtrap.layer = 1;
    sandtrap.collider = 'kinematic';
    sandtrap.color = 'tan';
    sandtrap.stroke = 'tan';

    return new GameObject("sandtrap", sandtrap);
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

    return new GameObject("tubes", [tubeA, tubeB]);
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
    // windmillBlades.color = "#B8860B";
    // windmillBlades.stroke = 'black';
    // windmillBlades.collider = 'kinematic';

    // Doing the blades all at once caused them to not get filled in (p5play doesn't like concave shapes).
    // If they weren't filled in, they could capture and drag the ball, especially during tests.
    // Therefore, I'm doing all 4 blades separately
    // Bottom blade
    windmillBlade1 = new Sprite([[posX,posY], [posX-12.5, posY+75], [posX+12.5, posY+75], [posX, posY]]);
    windmillBlade1.y= posY;
    windmillBlade1.offset.y = 50;
    windmillBlade1.color="#B8860B";
    windmillBlade1.stroke = 'black';
    windmillBlade1.collider = 'kinematic';

    // Right blade
    windmillBlade2 = new Sprite([[posX,posY], [posX+75, posY+12.5], [posX+75, posY-12.5], [posX, posY]]);
    windmillBlade2.x= posX;
    windmillBlade2.offset.x = 50;
    windmillBlade2.color = "#B8860B";
    windmillBlade2.stroke = 'black';
    windmillBlade2.collider = 'kinematic';

    // Top Blade
    windmillBlade3 = new Sprite([[posX,posY], [posX-12.5, posY-75], [posX+12.5, posY-75], [posX, posY]]);
    windmillBlade3.y= posY;
    windmillBlade3.offset.y = -50;
    windmillBlade3.color = "#B8860B";
    windmillBlade3.stroke = "black";
    windmillBlade3.collider = 'kinematic';

    // Left Blade
    windmillBlade4 = new Sprite([[posX,posY], [posX-75, posY+12.5], [posX-75, posY-12.5], [posX, posY]]);
    windmillBlade4.x= posX;
    windmillBlade4.offset.x = -50;
    windmillBlade4.color = "#B8860B";
    windmillBlade4.stroke = "black";
    windmillBlade4.collider = 'kinematic';

    // Come back to this later;
    return new GameObject("windmill", [windmillBody,
                                    [
                                        windmillBlade1,
                                        windmillBlade2,
                                        windmillBlade3,
                                        windmillBlade4
                                    ]
                                 ]);
    // return [windmillBody,windmillBlade1,windmillBlade2,windmillBlade3,windmillBlade4];
}

function Water(posX, posY, shape = "square") {

    let water;

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

    return new GameObject("water", water);
}

// Volcano sets ball to beginning
// May be fun to have it generate "lava" objects
function Volcano(posX, posY) {
    let volcano = new Sprite([[posX, posY], [posX - 50, posY + 75], [posX + 50, posY + 75], [posX, posY]],'s');
    volcano.color = '#8B4513';
    volcano.stroke = '#8B0000';
    volcano.layer = 0;
    volcano.collider = 'kinematic';

    return new GameObject("lava", volcano);
}
