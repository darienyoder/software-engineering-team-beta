const strokeForce = 25; // The speed of the ball when it is hit
const friction = { reg: 0.5, slow: 2, trigger: 0.2 };
const maxPullBackDistance = 100; // The maximum distance to pull back

var gameObjects = [], strokeCounts = []; strokeCount = 0, par = 0;
var level; // The level object; builds the stage
var ball, hole; // The player's golf ball and the hole
var canMove = true, ballInGoal = false, pullStart = null; // Starter variables
var message = '', messageTime = 0;
var putter;

var gameState = 'menu';
var fullGameMode = true;
var parMsgVisible = false;

cameraModeOptions = ["Center"] // Options that camera mode can take-- should be same as index.html's first camera option
var cameraMode = cameraModeOptions[0];  // Current camera mode, starts at center

let trajectoryColor = '#4433FF'; // Default trajectory color

//variables for ball velocity from previous frame; used in wall physics calculations
let prevVelX = 0;
let prevVelY = 0;
var ballLastPosition = 0;

// The canvas for drawing terrain. Goes under the main canvas.
var webglCanvas;
var webglContext;

// Sound variables
let hitSound, holeSound, waterSplash;

// Blitz Mode variables
let blitzMode = false;
let blitzTimer = 0; // Timer in milliseconds
let timerRunning = false; // Whether the timer is running
let timerStart = null; // When the timer started

var starCount = [];

// Loading sound files
async function loadSounds(){
    hitSound = loadSound('assets/golfPutt.wav');
    holeSound = loadSound('assets/golfGoal.wav');
    waterSplash = loadSound('assets/waterSplash.wav');
    click = loadSound('assets/buttonpress.mp3');
    boo = loadSound('assets/boo.mp3');
    jimmy = loadSound('assets/Jimmy.mp3');
    lava = loadSound('assets/lavaNoise.mp3');
    fizz = loadSound('assets/fizz.mp3');
}

function preload()
{
    progressLoadBar();
    // Music
    menuMusic = loadSound("assets/music/menu.mp3");
    courseMusic = loadSound("assets/music/course.mp3");
}

// Runs once when the program starts
async function setup()
{
    loadingProgress = 1.0;

    await loadSounds();

    menuMusic.loop();
    courseMusic.loop();

    document.getElementById('mainMenuButton').style.display = 'none';
    document.getElementById('retryButton').style.display = 'none';

    // // Starts the game / goes into level select once buttons are pressed if in the menu
    // document.getElementById('startButton').addEventListener('click', () => {
    //     if(gameState == 'menu') {
    //         startGame();
    //         document.getElementById('startButton').style.display = 'none';
    //         document.getElementById('levelSelectButton').style.display = 'none';
    //         document.getElementById('blitzModeButton').style.display = 'none';
    //     }
    //
    //     //Need this for camera to work
    //     if (cameraModeOptions.length<=1) {
    //         cameraModeOptions.push("Follow");
    //     }
    // })
    document.getElementById('levelSelectButton').addEventListener('click', () => {
        if(gameState == 'menu') {
            levelSelect()
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('levelSelectButton').style.display = 'none';
            document.getElementById('blitzModeButton').style.display = 'none';
        }
    })
    document.getElementById('mainMenuButton').addEventListener('click', () => {
        gameState = 'menu';
        document.getElementById('startButton').style.display = 'block';  // Show the button once in menu
        document.getElementById('levelSelectButton').style.display = 'block';
        document.getElementById('mainMenuButton').style.display = 'none';
        document.getElementById('retryButton').style.display = 'none';
        document.getElementById('blitzModeButton').style.display = 'block';
    })
    document.getElementById('retryButton').addEventListener('click', () => {
        document.getElementById('mainMenuButton').style.display = 'none';
        document.getElementById('retryButton').style.display = 'none';
        startGame();
    })


     // Blitz Mode toggle button setup
     document.getElementById('blitzModeButton').addEventListener('click', () => {
        blitzMode = !blitzMode;
        const blitzButton = document.getElementById('blitzModeButton');
        blitzButton.textContent = "Blitz Mode: " + (blitzMode ? "On" : "Off");
    });

    // Initialize canvas
    createCanvas();

    document.getElementById('cameraButton').addEventListener('click', () => {

        cameraMode = cameraModeOptions[(cameraModeOptions.indexOf(cameraMode) + 1) % cameraModeOptions.length];
        document.getElementById('cameraButton').innerText = `Camera Mode: ${cameraMode}`;

    });

    // Create WebGL Canvas
    webglCanvas = document.createElement("canvas");
    webglCanvas.id = "webglCanvas";
    webglCanvas.setAttribute('width', window.innerWidth);
    webglCanvas.setAttribute('height', window.innerHeight);
    webglCanvas.style.width = "100%";
    webglCanvas.style.height = "auto";
    webglCanvas.style.position = "fixed";
    webglCanvas.style.x = 0;
    webglCanvas.style.y = 0;
    webglCanvas.style.zIndex = 1;
    document.getElementById("defaultCanvas0").style.zIndex = 2;
    document.getElementsByTagName("main")[0].insertBefore(webglCanvas, document.getElementById("defaultCanvas0"));

    // Pass WebGL canvas to level object for drawing
    level = new Level(webglCanvas);

    // Add level select buttons to menu
    for (var i in levelData)
    {
        document.getElementById("level-select-wrapper").innerHTML += "<button class='level-select-button' onclick='level.load(" + i + "); menuMusic.stop(); courseMusic.play();'>"
            + (Number(i) + 1)
            + "<div class='level-select-star'></div>"
            + "<div class='level-select-star'></div>"
            + "<div class='level-select-star'></div>"
        + "</button>";
        starCount.push(0);
    }

    document.getElementById("loading-bar-bounds").style.width = "500px";
    setTimeout(function() {
        document.getElementById("loading-bar").style.display = "none";
        document.getElementById("loading-button").style.display = "block";
    }, 1000);

    createPutter();
}

var loadingProgress = 0.0;

function progressLoadBar()
{
    if (loadingProgress < 1.0)
    {
        if (false && loadingProgress < 0.7)
        {
            loadingProgress += 0.1 * 0.1;
        }
        else
        {
            loadingProgress += (0.9 - loadingProgress) * 0.01 * 0.7;
        }
        document.getElementById("loading-bar-progress").style.width = (loadingProgress * 100.0).toString() + "%"
        setTimeout(progressLoadBar, 1);
    }
    else
    {
        document.getElementById("loading-bar-progress").style.width = "100%";

    }
}

// Runs once, when the user starts the game
// Has to be separate from setup because music can't autoplay
function loadMainMenu()
{
    setMenu("main-menu");
    courseMusic.stop();
    menuMusic.play();
}

var currentMenu = "loading-screen";

function setMenu(newMenu) {
    currentMenu = newMenu;

    // Loop through all menus and set display
    for (var menu of document.getElementById("menus").children) {
        if (menu.id == newMenu)
            menu.style.display = "block";
        else
            menu.style.display = "none";
    }

    // Level Select Menu logic
    if (newMenu == "level-select") {
        clearSounds()
        for (var i in levelData) {
            for (var star = 0; star < 3; star++) {
                if (starCount[i] == 0)
                    document.getElementById("level-select-wrapper").children[i].children[star].style.display = "none";
                else {
                    document.getElementById("level-select-wrapper").children[i].children[star].style.display = "block";
                    if (star + 1 <= starCount[i])
                        document.getElementById("level-select-wrapper").children[i].children[star].style.backgroundImage = "url('assets/menu/star_gold.png')";
                    else
                        document.getElementById("level-select-wrapper").children[i].children[star].style.backgroundImage = "url('assets/menu/star_black.png')";
                }
            }
        }
    }
    // Level Complete Menu logic
    else if (newMenu == "level-complete") {
        clearSounds()
        for (var star = 0; star < 3; star++) {
            if (strokeCount <= levelData[level.number].par + 2 - star)
                document.getElementById("level-complete-stars").children[star].src = "assets/menu/star_gold.png";
            else
                document.getElementById("level-complete-stars").children[star].src = "assets/menu/star_black.png";
        }

        // Show completion time only in Blitz Mode
        if (blitzMode) {
            document.getElementById('completion-time').style.display = "block";
        } else {
            document.getElementById('completion-time').style.display = "none";
        }
    }
    // When switching to any other menu, hide the completion time (regular mode)
    else {
        document.getElementById('completion-time').style.display = "none";
    }
}

//Hit sound function
function playHitSound() {
    hitSound.play();
}

//Hole sound function
function playGoalSound() {
    holeSound.play();
}

//Hole sound function
function playWaterSound() {
    waterSplash.play();
}
function playClickSound(){
    click.play();
}
function playBooSound(){
    if ((Math.random() > 0.999) && !boo.isPlaying()) {
        boo.setVolume(0.5);
        boo.play();
    }
}
function playJimmySound(){
    if (!jimmy.isPlaying()) {
        jimmy.play();
    }
}
function playLavaSound(){
    if (!lava.isPlaying()){
        lava.setVolume(.75);
        lava.play()
    }
}
function playFizzSound(){
    if (!fizz.isPlaying()){
        fizz.play()
    }
}
function clearSounds(){ //wipe current playing sounds when level ends
    lava.stop();
    jimmy.stop()
    boo.stop()
}

function setupLevel(levelNum) {
    // Create the level layout using "level-generation.js"
    level.load(levelNum);
}

function createPutter()
{
    // Creating the putter head
    putter = new Sprite(10,10,5,10,'n');
    putter.image = 'assets/putter.png';
    putter.image.scale = .12;
    putter.image.offset.x = -100;
    putter.image.offset.y = -190;
    putter.visible = false;
    putter.layer = 1;
    putter.color = 130,130,130;
    putter.stroke = 'black';
    putter.debug = false;
    putter.offset.x = -10;

}

function startGame() {
    fullGameMode = true;
    strokeCount = 0;
    strokeCounts = [];
    ballInGoal = false;
    canMove = true;
    setupLevel(0);
    gameState = 'playing';
    ballLastPosition = createVector(0, 0);
}

// Runs 60 times per second
// Multiply your values by "deltaTime" when you want them to be in units of "per second".
async function draw()
{
    // Erase what was drawn the last frame
    clear();

    if (webglCanvas)
    {
        webglCanvas.setAttribute('width', window.innerWidth);
        webglCanvas.setAttribute('height', window.innerHeight);
    }

    if (menuMusic.isPlaying())
        menuMusic.setVolume(Number(document.getElementById("music-volume").value));
    if (courseMusic.isPlaying())
        courseMusic.setVolume(Number(document.getElementById("music-volume").value));

    world.timeScale = (currentMenu == "level") ? 1.0 : 0.0;

    if (gameState === 'menu') {
        // drawMainMenu();
    } else if (gameState === 'levelSelect') {
        // handleLevelSelect();
    }
    if (gameState === 'playing' || currentMenu == "level") {
        // Draw the stage using "level-generation.js"
        level.drawStage();

        if (parMsgVisible) {
            clear()
            await drawPar();
        } else {
            handleGamePlay();
        }
    } else if (gameState === 'gameOver') {
        // clearGameObjects(); // Clear objects before showing game over
        // drawGameOver();
    }
}

function drawMainMenu() {
    // Draw the main menu background
    fill(255); // White background for contrast
    rect(0, 0, width, height); // Optional: clear background
    background(backgroundColor);

    fill(0); // Set text color to black
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Golf Game", width / 2, height / 4);

    textSize(24);

    // Draw the background rectangle for the color visualization
    fill(floorColor); // Set rectangle color to #408040
    rect(width / 4, height * 2 / 3, width / 2, 130); // Rectangle behind the text

    // Set text color to the current trajectory color
    fill(trajectoryColor);
    textSize(18);
    text("Current Trajectory color\n", width / 2, (height * 2 / 3)+56);

    fill(0);
}

function levelSelect() {
    gameState = 'levelSelect';
    document.getElementById('mainMenuButton').style.display = 'block';
}

function levelSquare(x, y, size, levelNum) {
    fill(color(255, 0, 0));
    let lvlSqr = square(x, y, size);
    textSize(size/1.5);
    fill(0);
    text(levelNum, x + size/2, y + size/2); //puts level number in square

    //if square is clicked
    if (mouse.pressed() && mouseX > x && mouseX < (x+size) && mouseY > y && mouseY < (y+size)) {
        document.getElementById('mainMenuButton').style.display = 'none';
        playLevel(levelNum - 1);
    }
    return lvlSqr;
}

function playLevel(levelNum) {
    strokeCount = 0;
    ballInGoal = false;
    canMove = true;

    //camera options need this to work properly
    if (cameraModeOptions.length<=1){
        cameraModeOptions.push("Follow");
    }

    setupLevel(levelNum);
    fullGameMode = false; //prevents it from going to next level
    gameState = 'playing';
}

function handleLevelSelect() {
    var squaresPerRow = 10;
    //based on width of screen, picks square size so they will be evenly spaced
    var squareSize = width / ((squaresPerRow * 3 + 1) / 2);
    var horizontalOffset = squareSize/2;
    var verticalOffset = squareSize/2;
    let lvlSqr = [];

    for (var levelNum = 0; levelNum < levelData.length; levelNum++) { //make level squares for however many levels currently exist
        var x = horizontalOffset + (levelNum % squaresPerRow) * (horizontalOffset + squareSize); //spaces squares out from walls and each other
        var y = verticalOffset + floor(levelNum/squaresPerRow) * (verticalOffset + squareSize); //for if there are multiple rows
        lvlSqr[levelNum] = levelSquare(x, y, squareSize, levelNum + 1);
    }

}

function drawGameOver() {
    background("white");
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 4);
    textSize(24);
    var totalStrokes = 0;
    for (var strokes of strokeCounts)
        totalStrokes += strokes;
    text(`Strokes: ${totalStrokes}`, width / 2, height / 2);
    document.getElementById('mainMenuButton').style.display = 'block';
    document.getElementById('retryButton').style.display = 'block';
    clearSounds()

}

function keyPressed() {
    if (gameState === 'playing' && key === '`') {
        // Tilde runs tests
        runTests();
    } else if (key === '0') {
        // Press zero for elevation debugging
        showTopography = 1 - showTopography;
    }
}

async function handleGamePlay() {

    // Behavior for all GameObjects, *including* the ball and hole
    // To add or change behavior, go to game-objects.js
    if (currentMenu == "level")
        for (var object of gameObjects)
            object.update();

    canvas.resize(window.innerWidth, window.innerHeight);

    // Lerps camera zoom between just the ball and the entire level
    levelZoom = document.getElementById("zoom-slider").value;
    camera.x = lerp((level.bounds.right + level.bounds.left) / 2, ball.x, levelZoom);
    camera.y = lerp((level.bounds.bottom + level.bounds.top) / 2, ball.y, levelZoom);
    camera.zoom = lerp(Math.min(((window.innerWidth - level.levelMargin) / (level.bounds.right - level.bounds.left)), ((window.innerHeight - level.levelMargin) / (level.bounds.bottom - level.bounds.top))), 3.0, levelZoom);

    // Draw the stroke counter & Par

    if (!blitzMode) {
        drawStrokeCount();
        drawParCount();
    }

    // When mouse is pressed...
    if (mouse.presses() && canMove && levelToScreen(mouse.pos).x > 125 && levelToScreen(mouse.pos).x < window.innerWidth - 120) {
        // Record the start position of the pull-back
        lastHit = createVector(ball.x, ball.y);
        pullStart = createVector(mouseX, mouseY);
        putter.moveTo(ball.x, ball.y,100);
    }

    ball.velocity.x += level.getSlope(ball.x, ball.y).x;
    ball.velocity.y += level.getSlope(ball.x, ball.y).y;

    var trueVel = sqrt((ball.velocity.x * ball.velocity.x) + (ball.velocity.y * ball.velocity.y));

    if (trueVel > 0) {
        if (trueVel <= friction.trigger && trueVel != 0) {
            ball.drag = friction.slow;
            //Ball spin relative to trueVel
            ball.rotationSpeed = trueVel
        }
    } else {
        ball.drag = friction.reg;
        //Ball no spin
        ball.rotationSpeed = 0
    }


    // When mouse is released...
    if (mouse.releases() && (canMove || true) && pullStart) {
        // Calculate the pull vector and force
        let pullEnd = createVector(mouseX, mouseY);
        let pullVector = pullStart.sub(pullEnd);
        let pullDistance = constrain(pullVector.mag(), 0, maxPullBackDistance);
        let forceMagnitude = (pullDistance / maxPullBackDistance) * strokeForce;
        let forceDirection = pullVector.normalize();

        // Reset the pullStart
        pullStart = null;

        putter.visible = false; // hides the putter while it does its move

        // This moves the pivot point onto the handle
        putter.image.offset.x = 0;
        putter.image.offset.y = 300;

        putterRotation = putter.rotation;

        putter.move(20,putterRotation-180,500);
        await sleep(0);

        putter.move(-60,putterRotation+90,500);
        await sleep(0);
        putter.visible = true;

        // This is the swing
        putter.rotate(90,forceMagnitude/10);    //The  /10 can be changed to whatever looks best
        await sleep(250);
        putter.rotate(-90,forceMagnitude/10);
        hitSound.play(); //Playing the ball hit sound
        await sleep(250);

        // Hide the putter
        putter.visible = false;
        putter.image.offset.x = -100;
        putter.image.offset.y = -190;

        ball.applyForce(forceMagnitude * forceDirection.x, forceMagnitude * forceDirection.y);


        if (pullDistance > 0) {
            // hitSound.play(); //Playing the ball hit sound // This is a duplicate; check 12 lines above
            incrementShots();
            // Just clicking does not increment shots anymore
        }
    }

    if (pullStart)
    {
        drawTrajectory();
        drawUserAssistance();
        drawPutter();
    }

    // Iterate through each wall in the level
    for (var wall of level.walls)
    {
        // Check if the ball and the wall have collided
        if (ball.collides(wall))
        {
            let normalVector;

            // If the wall is a circle (like on rounded corners), the normal is the direction from the wall to the ball
            if (wall.width == wall.height)
            {
                normalVector = createVector(ball.x, ball.y).sub(createVector(wall.x, wall.y)).normalized();
            }
            // If the wall is a segment, the normal is the rotation of the sprite +/- 90 degrees
            // There is a normal vector for each side of the wall, so calculate each vector's distance to the ball and use whichever is closest
            else
            {
                let positiveNormalVector = p5.Vector.fromAngle(radians(wall.rotation + 90));
                let negativeNormalVector = p5.Vector.fromAngle(radians(wall.rotation - 90));

                if (ball.distanceTo(createVector(wall.x, wall.y) + positiveNormalVector) < ball.distanceTo(createVector(wall.x, wall.y) + negativeNormalVector))
                {
                    normalVector = positiveNormalVector;
                }
                else
                {
                    normalVector = negativeNormalVector;
                }
            }

            //Calculate new ball velocity manually
            const wallFriction = 0.8;
            let velocityVector = createVector(prevVelX, prevVelY);
            velocityVector.reflect(normalVector).mult(wallFriction);
            ball.vel.x = velocityVector.x;
            ball.vel.y = velocityVector.y;

            break;
        }
    }

    //Store velocity from current frame for next frame's velocity calculations
    //This avoids p5play applying it's own physics to the wall bounce before I apply mine
    prevVelX = ball.vel.x;
    prevVelY = ball.vel.y;

    // Hole functionality Ball must be going slow to get in hole
    if (hole.overlaps(ball))
    {
        clearSounds()
        ballInGoal = true;
        holeSound.play();
        canMove = false;
        ball.moveTo(hole.position.x, hole.position.y);

        let timeAtCompletion = 0; // Store the final time when the player finishes
        if (blitzMode) {
            timerRunning = false; // Stop the timer
            timeAtCompletion = blitzTimer; // Store the final time
            blitzTimer = 0;
        }
        strokeCounts.push(strokeCount);

        if (strokeCount <= levelData[level.number].par)
            starCount[level.number] = 3;
        else if (strokeCount <= levelData[level.number].par + 1)
            starCount[level.number] = Math.max(2, starCount[level.number]);
        else if (strokeCount <= levelData[level.number].par + 2)
            starCount[level.number] = Math.max(1, starCount[level.number]);

        await sleep(2000);

        // clear();
        // jimmy.stop();
        // level.clear();
        // parMsgVisible = true;
        // await sleep(2000);

        // level.clear();
        if (blitzMode) {
        // Convert timeAtCompletion (in milliseconds) to minutes and seconds format
        let seconds = Math.floor(timeAtCompletion / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let finalTimeDisplay = `${minutes}:${nf(seconds, 2)}`; // Format as mm:ss

        // Update the HTML to show the time
        document.getElementById('completion-time').textContent = `Time: ${finalTimeDisplay}`;
        }

        setMenu("level-complete");
        ballInGoal = false;
        canMove = true;
    }

    // Ball has to be stopped in order to move
    if(!ballInGoal) {
        if (blitzMode)
        { // Only allow instant hit if blitz mode is active
            canMove = true;
            if (!message) {
                message = "Blitz Mode Active";
                messageTime = millis();
            }
        }
        else if (ball.stillTime > 360 || (ball.vel.x==0 && ball.vel.y==0))
        {
            canMove = true //Player can take the next shot
            ball.vel.setMag(0.0);
            if (!message) {
                message = "Take Your Shot"; //Set the message
                messageTime = millis(); //Record when message was displayed
            }
        }
        else
        {
            canMove = false
        }

        if(message){
            drawMessage(); //Display message
        }

        if(millis() - messageTime >= 3000){ //Clear the message
            message = ''; //Reset the message
        }
    }

    if (blitzMode && timerRunning) {
        drawTimer();  // Draw the timer while Blitz Mode is active
        blitzTimer = millis() - timerStart;  // Update the timer value
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

function drawStrokeCount()
{
    // fill(0); // Set text color to black
    // textSize(20); // Set text size
    // textAlign(RIGHT, TOP); // Align text to the top-right corner
    // text(`Strokes: ${strokeCount}`, width - 20, 20); // Draw the stroke count
}

function drawParCount()
{
    // fill(0); // Set text color to black
    // textSize(20); // Set text size
    // textAlign(LEFT, TOP); // Align text to the top-right corner
    // text(`Par: ${par}`, 20, 20); // Draw the stroke count
}

function drawTimer() {
    let seconds = Math.floor(blitzTimer / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let timerDisplay = `${minutes}:${nf(seconds, 2)}`; // Format time as 0:00

    fill(0); // Black color for the text
    textSize(32); // Adjust text size as needed
    textAlign(LEFT, TOP); // Align text to the top left
    text(`Time: ${timerDisplay}`, 10, 8); // Position the timer
}

function incrementShots()
{
    strokeCount++;
    if (blitzMode && strokeCount === 1) {
        // Start the Blitz Mode timer on the first stroke
        timerStart = millis();
        timerRunning = true;
    }
}

function drawTrajectory() {
    if (pullStart === null) return; // No trajectory to draw if no pullStart is set

    // Ball's current position as the start position
    let startX = ball.position.x;
    let startY = ball.position.y;

    // Convert ball position to screen coordinates
    let screenStart = levelToScreen(createVector(startX, startY));

    // Convert pullStart to screen coordinates
    let screenPullStart = levelToScreen(pullStart);

    // Convert current mouse position to screen coordinates
    let screenMousePos = levelToScreen(createVector(mouseX, mouseY));

    // Calculate the pull vector from pullStart to mouse position
    let pullVector = createVector(screenPullStart.x-screenMousePos.x, screenPullStart.y-screenMousePos.y);
    let pullDistance = constrain(pullVector.mag(), 0, maxPullBackDistance);
    pullVector.normalize();
    pullVector.mult(pullDistance);

    // Draw trajectory line
    push(); // Start new style for the line
    stroke(trajectoryColor); // Can be any color
    strokeWeight(5);
    line(screenStart.x, screenStart.y, screenStart.x + pullVector.x, screenStart.y + pullVector.y);
    pop(); // Remove style
}

function drawUserAssistance() {
    // Ensure pullStart is set
    if (pullStart === null) return;

    // Convert pullStart to screen coordinates
    let screenPullStart = pullStart;

    // Convert current mouse position to screen coordinates
    let screenMousePos = createVector(mouseX, mouseY);

    // Calculate the pull vector from pullStart to mouse position
    let pullVector = createVector(screenMousePos.x - screenPullStart.x, screenMousePos.y - screenPullStart.y);

    // Draw trajectory line
    push(); // Start new style for the line
    stroke('grey'); // Color for the line
    strokeWeight(5);
    // Draw line from pullStart to current mouse position
    line(screenPullStart.x, screenPullStart.y, screenPullStart.x + pullVector.x, screenPullStart.y + pullVector.y);
    pop(); // Remove style
}

function drawMessage() {
    // fill(0); //Setting text color
    // textSize(24); //Setting text size
    // textAlign(CENTER, CENTER); // Centering text
    // text(message, width / 2, height / 9 * 2.5); //Moving the up
}

function drawPutter(){
    // Draw the putter back in
    putter.visible = true;
    let mouseOnScreen =  levelToScreen(createVector(mouseX, mouseY));
    putter.rotateTowards(atan2(levelToScreen(pullStart).y - mouseOnScreen.y, levelToScreen(pullStart).x - mouseOnScreen.x), .3);
}

function distanceSquaredToLineSegment(lx1, ly1, lx2, ly2, px, py) {
    var ldx = lx2 - lx1,
       ldy = ly2 - ly1,
       lineLengthSquared = ldx*ldx + ldy*ldy;
    return distanceSquaredToLineSegment2(lx1, ly1, ldx, ldy, lineLengthSquared, px, py);
}

function distanceToLineSegment(lx1, ly1, lx2, ly2, px, py)
{
    return Math.sqrt(distanceSquaredToLineSegment(lx1, ly1, lx2, ly2, px, py));
}

async function drawPar() {
    // Clear the background if needed
    // clear();
    background(backgroundColor);
    try {
        let sCount = strokeCounts[strokeCounts.length - 1];
        let lPar = par;
        let parMsg = ""; // Use let for block scope

        switch (sCount) {
            case 1:
                parMsg = "Ace / Hole in One";
                break;
            case lPar:
                parMsg = "Par";
                break;
            case (lPar - 1):
                parMsg = "Birdie";
                break;
            case (lPar - 2):
                parMsg = "Eagle";
                break;
            case (lPar - 3):
                parMsg = "Albatross";
                break;
            case (lPar + 1):
                parMsg = "Bogey";
                break;
            case (lPar + 2):
                parMsg = "Double Bogey";
                break;
            case (lPar + 3):
                parMsg = "Triple Bogey";
                break;
            case (lPar + 4):
                parMsg = "Quadruple Bogey";
                break;
            default:
                parMsg = sCount + " Strokes";
                break;
        }
        push();
        // background("white");
        fill(0); // Set text color
        textSize(36);
        textAlign(CENTER, TOP);
        text(parMsg, width / 2, height / 3);
        textSize(24);
        text("Wait a moment...", width / 2, height / 1.5);
        await sleep(2000)
        pop();
    } catch {
        return;
    }
    parMsgVisible = false;
}
