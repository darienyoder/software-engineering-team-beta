var gameObjects = [];
var lavaObjects = [];


class GameObject {

    // "type" specifies what object it is.
    // "sprites" contains every P5play sprite the object uses.
    constructor(_type = "", _sprites = []) {
        this.type = _type;
        if (Array.isArray(_sprites))
            this.sprites = _sprites;
        else
            this.sprites = [_sprites];
        if (this.sprites.length > 0)
            this.sprite = this.sprites[0];
    }

    // Runs every frame
    update() {
        switch (this.type) {
            case "ball":
                switch (level.getSurface(this.sprite.x, this.sprite.y))
                {
                    case SURFACE_SAND:
                        this.sprite.vel.setMag(Math.max(0.0, this.sprite.vel.mag() - 5 / deltaTime))
                        break;
                    case SURFACE_WATER:
                        this.sprite.vel.x = 0;
                        this.sprite.vel.y = 0;
                        this.sprite.x = lastHit.x;
                        this.sprite.y = lastHit.y;
                        break;
                }
                if ( Math.sqrt(Math.pow(this.sprite.lastPos.x - this.sprite.pos.x, 2.0) + Math.pow(this.sprite.lastPos.y - this.sprite.pos.y, 2.0)) < 0.5)
                    {
                        this.sprite.stillTime += 1;
                    }
                else
                    this.sprite.stillTime = 0;

                    this.sprite.lastPos = createVector(this.sprite.x, this.sprite.y);
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
                if (this.sprites[0].overlaps(ball))
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
                    waterSplash.play();

                    ball.vel.x = 0;
                    ball.vel.y = 0;
                    ball.x = lastHit.x;
                    ball.y = lastHit.y;
                }

                break;

            case "volcano":
                let volcSpeed = 75; // CANNOT be less than 21!!

                // Generate Lava
                if (frameCount % volcSpeed == 0) {
                    let aLava = new Sprite(this.sprites[0].x, this.sprites[0].y-55, random(10,20));
                    aLava.life = volcSpeed;
                    playLavaSound();
                    let randColor = random(0, 3);
                    if (randColor < 1)
                        aLava.color = 'red';
                    else if ((randColor < 2) && (randColor >= 1))
                        aLava.color = 'yellow';
                    else
                        aLava.color = 'orange'
                    lavaObjects.push(aLava);
                }

                // Object Movement
                if(frameCount % volcSpeed <= 20){
                    for (var i = 0; i < lavaObjects.length; i++){
                        lavaObjects[i].vel.x = random(-1,1);
                        lavaObjects[i].vel.y = -2;
                    }
                }
                if(frameCount % volcSpeed > 20){
                    for (let i = 0; i < lavaObjects.length; i++){
                        lavaObjects[i].bearing = 90;
                        lavaObjects[i].applyForce(5);
                    }
                }

                // Deletion from list after life ends
                let loLength = lavaObjects.length;
                for (let i = 0; i < loLength; i++){
                    if(((frameCount%volcSpeed) == (volcSpeed-1))
                        && (loLength>0))
                    {
                        lavaObjects.pop();
                    }
                }


                // Handle collisions with objects
                // These only work for the first instance of each object :( --What does that even mean?
                for (let i = 0; i < lavaObjects.length; i++) {
                    if (ball.overlaps(lavaObjects[i])) {
                        playFizzSound();
                        ball.vel.x = 0;
                        ball.vel.y = 0;
                        ball.x = ballStart.x;
                        ball.y = ballStart.y;
                    }

                    for (var sand of getObjectsByType("sandtrap")) {
                        lavaObjects[i].overlaps(sand.sprites[0]);
                    }
                    for (var water of getObjectsByType("water")) {
                        if (lavaObjects[i].overlaps(water.sprites[0])) {
                                lavaObjects[i].life = 1;
                            }
                    }
                    for (var windmill of getObjectsByType("windmill")) {
                        lavaObjects[i].overlaps(windmill.sprites[0]);
                    }
                    for (var tubes of getObjectsByType("tubes")) {
                        lavaObjects[i].overlaps(tubes.sprites[1]);
                        if (tubes.sprites[0].overlaps(lavaObjects[i])) {
                            lavaObjects[i].x = tubes.sprites[1].x;
                            lavaObjects[i].y = tubes.sprites[1].y;
                        }
                    }
                    for (var hole of getObjectsByType("hole")) {
                        lavaObjects[i].overlaps(hole.sprites[0]);
                    }
                }

                break;

            case "ghost":
                //When active float towards ball
                this.sprites[0].rotation = 0;
                if (this.sprites[0].active && this.sprites[0].sg){
                    this.sprites[0].moveTowards(ball.x, ball.y, .004);
                    playJimmySound();
                }
                else if (this.sprites[0].active){
                    this.sprites[0].moveTowards(ball.x, ball.y, .004);
                    playBooSound();
                }
                if (this.sprites[0].overlaps(ball))
                {
                    ball.vel.x = 0;
                    ball.vel.y = 0;
                    ball.x = ballStart.x;
                    ball.y = ballStart.y;
                }

                break;

            // Fan
            case "fan":
                let fanDist = sqrt(((ball.x-this.sprites[0].x)**2)+((ball.y-this.sprites[0].y)**2));
                let fanPower = 25;
                let  fanFurthest = 100;

                // East Blowing Fan
                if(this.sprites[0].rotation == 0){

                    if (ball.y >= this.sprites[0].y-25 &&
                        ball.y <= this.sprites[0].y+25 &&
                        ball.x >= this.sprites[0].x &&
                        ball.x <= this.sprites[0].x + fanFurthest){

                        ball.vel.x += abs(fanPower/fanDist);
                    }
                }

                // South Blowing Fan
                else if(this.sprites[0].rotation ==90){
                    if (ball.x >= this.sprites[0].x-25 &&
                        ball.x <= this.sprites[0].x+25 &&
                        ball.y <= this.sprites[0].y + fanFurthest &&
                        ball.y >= this.sprites[0].y){

                        ball.vel.y += abs(fanPower/fanDist);
                    }
                }

                // West Blowing Fan
                else if(this.sprites[0].rotation == 180){
                    if (ball.y >= this.sprites[0].y-25 &&
                        ball.y <= this.sprites[0].y+25 &&
                        ball.x <= this.sprites[0].x &&
                        ball.x >= this.sprites[0].x - fanFurthest){

                        ball.vel.x -= abs(fanPower/fanDist);
                    }
                }

                // North Blowing Fan
                else {
                    if (ball.x >= this.sprites[0].x-25 &&
                        ball.x <= this.sprites[0].x+25 &&
                        ball.y <= this.sprites[0].y &&
                        ball.y >= this.sprites[0].y - fanFurthest){

                        ball.vel.y -= abs(fanPower/fanDist);
                    }
                }

                break;

            case "button":
                if (this.sprites[0].overlaps(ball)&& !this.active){
                    this.active=true;
                    this.sprites[0].image = 'assets/Button-on.png';
                    this.sprites[0].image.scale=.25;
                    playClickSound();
                    //This is where we need to modify the ghost object's .active and .visible
                    let ghosts = getObjectsByType("ghost");
                    if (ghosts.length > 0) {
                        let ghost = ghosts[0]; // Assuming only one ghost
                        ghost.sprites[0].active = true;
                        ghost.sprites[0].visible = true;
                }
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
    newBall.diameter = 10;
    newBall.color = "#ffffff";
    newBall.layer = 2;
    newBall.drag = friction.reg;
    newBall.lastPos = createVector(newBall.pos.x, newBall.pos.y);
    newBall.stillTime = 300;
    newBall.image = 'assets/golf_ball.png';
    newBall.image.scale = 0.084388 * 0.5;

    return new GameObject("ball", newBall);
}

function Hole(x, y)
{
    let newHole = new Sprite(x, y);
    newHole.diameter = 20;
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
    tubeA.image = 'assets/portal.png';
    tubeA.image.scale = 0.2;
    tubeA.rotationSpeed = 2;

    let tubeB = new Sprite(tubebX, tubebY, 50, 50);
    tubeB.collider = 'kinematic';
    tubeB.layer = 1;
    tubeB.color = '#4f2956';
    tubeB.stroke = '#4f2956';
    tubeB.image = 'assets/portal.png';
    tubeB.image.scale = 0.2;
    tubeB.rotationSpeed = -2;

    return new GameObject("tubes", [tubeA, tubeB]);
}

function Windmill(posX, posY)
{
    windmillBody = new Sprite([[posX, posY], [posX - 25, posY + 75], [posX + 25, posY + 75], [posX, posY]],'s');
    windmillBody.color = 'white';
    windmillBody.stroke = 'white';
    windmillBody.layer = 0;

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

    return new GameObject("windmill", [windmillBody,
                                    [
                                        windmillBlade1,
                                        windmillBlade2,
                                        windmillBlade3,
                                        windmillBlade4
                                    ]
                                 ]);
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
// May be fun to have it generate "volcano" objects
function Volcano(posX, posY) {
    let volcano = new Sprite([[posX, posY], [posX - 50, posY + 75], [posX + 50, posY + 75], [posX, posY]],'s');
    volcano.color = '#622a0f';
    volcano.stroke = 'black';
    volcano.layer = 0;
    volcano.collider = 'kinematic';

    return new GameObject("volcano", volcano);
}

function Ghost(posX, posY){
    let ghost = new Sprite(posX, posY);
    ghost.width=10;
    ghost.height=10;
    ghost.sg=false;
    ghost.image = 'assets/ghost.png';
    ghost.image.scale=.3;
    ghost.layer=0;
    //5 percent chance of the ghost being saul goodman
    if (Math.random() > 0.95) {
        ghost.sg=true;
        ghost.image = 'assets/Saulbetter.png';
        ghost.image.scale=.1;
    }
    ghost.layer=1;
    ghost.active=false;
    ghost.visible=false;
    return new GameObject("ghost", ghost);
}
function Button(posX, posY){
    let button = new Sprite(posX,posY);
    button.width=10;
    button.height=10;
    button.collider = 'none';
    button.image = '/assets/Button-off.png';
    button.image.scale=.25;
    button.active=false;
    button.layer=0;
    return new GameObject("button", button)
}
function Rock(posX,posY){
    let rock = new Sprite(posX,posY, 20, 20);
    rock.color='gray';
    rock.collider='static';
    rock.rotation = random(-90,90);
    return new GameObject("rock",rock);
}
// Make fan
function Fan(posX, posY, dir){
    let fan = new Sprite(posX, posY, 'k');
    fan.diameter = 50;
    // let fan = new Sprite([[posX+25,posY], [posX, posY+25], [posX, posY-25], [posX+25, posY]]);
    fan.color = '#A9A9A9';
    fan.layer = 0;

    // Directional Arrows:
    // 0 = east (0 degrees)
    if (dir == 0){
        fan.rotation = 0;
        arrow = new Sprite([[posX+25,posY], [posX, posY+25], [posX, posY-25], [posX+25, posY]],'k');
    }
    // 1 = south (90 degrees)
    else if (dir == 1 || dir == 90){
        fan.rotation = 90;
        arrow = new Sprite([[posX,posY+25], [posX+25, posY], [posX-25, posY], [posX, posY+25]],'k');
    }
    // 2 = west (180 degrees)
    else if (dir == 2 || dir == 180){
        fan.rotation = 180;
        arrow = new Sprite([[posX-25,posY], [posX, posY+25], [posX, posY-25], [posX-25, posY]],'k');
    }
    // 3 = north (270 degrees)
    else{
        fan.rotation = 270;
        arrow = new Sprite([[posX,posY-25], [posX+25, posY], [posX-25, posY], [posX, posY-25]],'k');
    }

    arrow.color = '#A9A9A9';
    arrow.strokeWeight = .1;
    // fan.addCollider([[posX+25,posY], [posX, posY+25], [posX, posY-25], [posX+25, posY]]);
    // fan.addCollider(0, 0, 50);
    // fan.addCollider([[10,16],[123,203],[23,-23],[10,16]]);

    /*windmillBlade1 = new Sprite([[posX,posY], [posX-12.5, posY+75], [posX+12.5, posY+75], [posX, posY]]);
    fanBlade1.y= posY;
    fanBlade1.offset.y = 50;
    fanBlade1.color="#B8860B";
    fanBlade1.stroke = 'black';
    fanBlade1.collider = 'kinematic';*/

    return new GameObject("fan", [fan, arrow,
        /*[
            fanBlade1,
            fanBlade2,
            fanBlade3,
            fanBlade4
        ]
     */]);
}
