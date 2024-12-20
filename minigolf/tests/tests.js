const tests = [];

function addTest(name, testFunction) {
    tests.push({ name, testFunction });
}

async function runTests() {
    let allPassed = true;
    for (const test of tests) {
        setupTestEnvironment();

        try {
            await test.testFunction();
            console.log(`✔️ ${test.name} passed`);
        } catch (error) {
            console.error(`❌ ${test.name} failed: ${error.message}`);
            allPassed = false;
        }
    }
    if (allPassed) {
        console.log('All tests passed!');
        return allPassed;
    } else {
        console.log('Some tests failed. Check above for details.');
        return allPassed;
    }
}

function setupTestEnvironment() {
    level.loadLevelFromDict(testLevel);
};


// Example Tests
addTest('Initial Stroke Count', async () => {
    await sleep(1000); // Wait for lava to disperse
    strokeCount = 0;
    if (strokeCount !== 0) throw new Error('Expected strokeCount to be 0');
});

// addTest('Setup Volcanoes', async () => {
//     level.loadLevelFromDict(testVolcanoes);
// });

addTest('Ball Movement', async () => {
    const initialPosition = { x: ball.x, y: ball.y };
    ball.applyForce(50, -50); // Simulating a force
    await sleep(1000); // Wait for the ball to move
    if (ball.x === initialPosition.x && ball.y === initialPosition.y) {
        throw new Error('Expected ball to move');
    }
});

/*
addTest('Ball Angle Bounce Test', async () => {
    function getBallAngle(ball) {
        const angleRadians = Math.atan2(ball.vel.y, ball.vel.x);
        const angleDegrees = angleRadians * (180 / Math.PI);
        return parseFloat(angleDegrees.toFixed(2));
    }

    ball.vel = { x: 0, y: 0 };
    ball.x = ball.y = 10;

    await sleep(50); //Let the ball settle

    ball.applyForce(50, -50);
    await sleep(50); // Wait for the ball to move
    let initAngle = getBallAngle(ball);

    await sleep(100); // Wait for the ball to bounce
    let finAngle = getBallAngle(ball);

    // // Simple angle monitoring, uncomment if needed
    // console.log("initAngle: " + initAngle);
    // console.log("finAngle: " + finAngle);

    if ((finAngle * -1) !== initAngle) {
        throw new Error('Expected ball to move');
    }
    ball.vel = { x: 0, y: 0 };
});
*/

/*
// Add this test to your existing tests array
addTest('Ball Drag Test', async () => {
    ball.vel = { x: (frictionTrigger * 2), y: 0 };

    // Check the drag value
    // May also want to check that it's not in a sandtrap here
    if (ball.drag !== friction) {
        throw new Error(`Expected ball.drag to be ${friction} when moving, but got ${ball.drag}`);
    }

    ball.vel = { x: (frictionTrigger / 2), y: (frictionTrigger / 2)}
    await sleep(50); //Might need to be proportional to slowFriction

    // Check the drag value
    if (ball.drag !== slowFriction) {
        throw new Error(`${ball.velocity} Expected ball.drag to be ${slowFriction} when velocity in trigger range, but got ${ball.drag}`);
    }
    ball.vel = { x: 0, y: 0 };
});
*/

// Test the Sand
addTest('Sand test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = getObjectsByType("sandtrap")[0].sprites[0].x - 40;
    ball.y = getObjectsByType("sandtrap")[0].sprites[0].y + 5;

    // Commented out code makes sure it fails (if volcano has been removed)
    // ball.x = ballStart.x - 20;
    // ball.y = ballStart.y;
    // initVel = 3;
    // ball.vel.y = initVel;

    initVel = 3;
    ball.vel.x = initVel;
    await sleep (150);
    afterVel = ball.vel.y;

    // Check the slowing of new velocity
    if ((afterVel >= initVel / 3) || (afterVel >= initVel / 3)) {
        throw new Error(`Expected afterVel to be less than ${initVel/3} when in sandtrap, but got ${afterVel}`);
    }

    // Reset velocity so it doesn't mess up other tests
    ball.vel = { x: 0, y: 0 };
});


// Test that the windmill works
addTest('Windmill Push Test', async () => {
    ball.vel = { x: 0, y: 0 };
    initialX = ball.velocity.x;
    initialY = ball.velocity.y;
    ball.x = getObjectsByType("windmill")[0].sprites[0].x -50;
    ball.y = getObjectsByType("windmill")[0].sprites[0].y -50;
    await sleep (2500)

    // Check the drag value
    if (ball.x == initialX && ball.y == initialY) {
        throw new Error(`Expected ball to not be at ${initialX.x}, ${initialY.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel = { x: 0, y: 0 };
});

/*
// Test that the tubes work as expected
// Be careful because on some maps, tubes put the ball in goal
addTest('Tube Teleportation test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = getObjectsByType("tubes")[0].sprites[0].x;
    ball.y = getObjectsByType("tubes")[0].sprites[0].y;
    await sleep(1000); // Wait for any animations
    if ((ball.x == getObjectsByType("tubes")[0].sprites[0].x) && (ball.y == getObjectsByType("tubes")[0].sprites[0].y)) {
        throw new Error(`Expected ball to not be at ${getObjectsByType("tubes")[0].sprites[0].x}, ${getObjectsByType("tubes")[0].sprites[0].y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel = { x: 0, y: 0 };
});
*/

/*
// Test the water
addTest('Water Test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.lastHit = {x: ballStart, y: ballStart};
    ball.x = getObjectsByType("water")[0].sprites[0].x;
    ball.y = getObjectsByType("water")[0].sprites[0].y;
    initialX = ball.velocity.x
    await sleep (100)

    // Check both that it's not at the water and is at lastHit
    if (ball.x == getObjectsByType("water")[0].sprites[0].x && ball.y == getObjectsByType("water")[0].sprites[0].y && ball.x != lastHit.x && ball.y != lastHit.y) {
        throw new Error(`Expected ball to not be at ${lastHit.x}, ${lastHit.y}, but it is at ${getObjectsByType("water")[0].sprites[0].x}, ${getObjectsByType("water")[0].sprites[0].y}`);
    }
    ball.vel = { x: 0, y: 0 };
});
*/

// Test the volcano
addTest('Volcano Test', async () => {
    ball.vel = { x: 0, y: 0 };

    stopLava = new Sprite([[getObjectsByType("volcano")[0].sprites[0].x-100,
        getObjectsByType("volcano")[0].sprites[0].y-15],
        [getObjectsByType("volcano")[0].sprites[0].x+100,
        getObjectsByType("volcano")[0].sprites[0].y-15]],'s');

    // Wait for lava to despawn then move ball
    while(frameCount % 75 > 1){
        await sleep(1);
    }


    ball.x = getObjectsByType("volcano")[0].sprites[0].x+50;
    ball.y = getObjectsByType("volcano")[0].sprites[0].y;
    ball.vel.x = -5;
    await sleep(500);

    // Check that it didn't get past the volcano
    if (ball.x <= getObjectsByType("volcano")[0].sprites[0].x) {
        throw new Error(`Expected ball.x to be greater than ${getObjectsByType("volcano")[0].sprites[0].y-15}, but instead got ${ball.x}`);
    }

    stopLava.remove();
    ball.vel = { x: 0, y: 0 };
});

/*
// Test the volcano's lava with the ball
addTest('Lava Test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = getObjectsByType("volcano")[0].sprites[0].x;
    ball.y = getObjectsByType("volcano")[0].sprites[0].y-75;
    await sleep (2500);

    // Check that it's at ballStart and isn't moving
    if (ball.x != ballStart.x || ball.y != ballStart.y) {
        throw new Error(`Expected ball to be at ${ballStart.x}, ${ballStart.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) {
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }

    ball.vel = { x: 0, y: 0 };
});
*/

// Test the volcano's lava with the sandtrap
addTest('Lava Sandtrap Test', async () => {
    // Wait until new lava exists
    // We don't want to break anything on accident
    // 75 is the local var volcSpeed in game-objects.js
    while(frameCount % 75 > 1){
        await sleep(1);
    }
    lavaObjects[0].x = getObjectsByType("sandtrap")[0].sprites[0].x;
    lavaObjects[0].y = getObjectsByType("sandtrap")[0].sprites[0].y;

    await sleep (100);

    // Check that it's inside the sandtrap and not outside of it
    if (lavaObjects[0].x > getObjectsByType("sandtrap")[0].sprites[0].x+50
        || lavaObjects[0].x < getObjectsByType("sandtrap")[0].sprites[0].x-50
        || lavaObjects[0].y > getObjectsByType("sandtrap")[0].sprites[0].y+50
        || lavaObjects[0].y < getObjectsByType("sandtrap")[0].sprites[0].y-50) {
        throw new Error(`Expected lava to be near ${getObjectsByType
            ("sandtrap")[0].sprites[0].x}, ${getObjectsByType
            ("sandtrap")[0].sprites[0].y}, but it is at ${lavaObjects[0].x}, ${lavaObjects[0].y}`);
    }

    lavaObjects[0].life = 1;
});

// Test the volcano's lava with the tubes
addTest('Lava Tubes Test', async () => {
    // Wait until new lava exists
    // We don't want to break anything on accident
    // 75 is the local var volcSpeed in game-objects.js
    while(frameCount % 75 > 1){
        await sleep(1);
    }

    lavaObjects[0].x = getObjectsByType("tubes")[0].sprites[0].x;
    lavaObjects[0].y = getObjectsByType("tubes")[0].sprites[0].y;
    await sleep (300);

    // Check that it's inside the sandtrap and not outside of it
    if (lavaObjects[0].x > getObjectsByType("tubes")[0].sprites[1].x+50
        || lavaObjects[0].x < getObjectsByType("tubes")[0].sprites[1].x-50
        || lavaObjects[0].y > getObjectsByType("tubes")[0].sprites[1].y+50
        || lavaObjects[0].y < getObjectsByType("tubes")[0].sprites[1].y-50) {
        throw new Error(`Expected lava to be near ${getObjectsByType
            ("tubes")[0].sprites[1].x}, ${getObjectsByType
            ("tubes")[0].sprites[1].y}, but it is at ${lavaObjects[0].x}, ${lavaObjects[0].y}`);
    }

    lavaObjects[0].life = 1;
});

// Test the volcano's lava with the windmill
addTest('Lava Windmill Test', async () => {
    // Wait until new lava exists
    // We don't want to break anything on accident
    // 75 is the local var volcSpeed in game-objects.js
    while(frameCount % 75 > 1){
        await sleep(1);
    }
    lavaObjects[0].diameter = 20;

    lavaObjects[0].x = getObjectsByType("windmill")[0].sprites[0].x-25;
    lavaObjects[0].y = getObjectsByType("windmill")[0].sprites[0].y;
    stopLava = new Sprite([[getObjectsByType("volcano")[0].sprites[0].x-100,
        getObjectsByType("windmill")[0].sprites[0].y+75],
        [getObjectsByType("windmill")[0].sprites[0].x+100,
        getObjectsByType("windmill")[0].sprites[0].y+75]],'s');
    await sleep (1100); // Lava risks despawning before checks

    // Check that it's inside the sandtrap and not outside of it
    if (lavaObjects[0].x < getObjectsByType("windmill")[0].sprites[1].x-75
        || lavaObjects[0].y > getObjectsByType("windmill")[0].sprites[1].y+100
        || lavaObjects[0].y < getObjectsByType("windmill")[0].sprites[1].y) {
        throw new Error(`Expected lava to be near ${getObjectsByType
            ("windmill")[0].sprites[0].x}, ${getObjectsByType
            ("windmill")[0].sprites[0].y}, but it is at ${lavaObjects[0].x}, ${lavaObjects[0].y}`);
    }

    stopLava.remove();
    lavaObjects[0].life = 1;
});

// Test fan movement
addTest('East Fan Move Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x + 50;
    startFanY = getObjectsByType("fan")[0].sprites[0].y;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 0;
    await sleep (500);

    // Check that it moved and has velocity
    if (ball.x <= startFanX) { // Check coordinates
        throw new Error(`Expected ball x to be greater than ${startFanX} but it is at ${ball.x}`);
    }
    if (ball.vel.x <= 0) { // Check vel
        throw new Error(`Expected ball.vel.x to be greater than ${0}, but got ${ball.vel.x}`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan's max distance (100)
addTest('East Fan Furthest Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x+125;
    startFanY = getObjectsByType("fan")[0].sprites[0].y;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 0;
    await sleep (500);

    // Check that it stayed still
    if (ball.x != startFanX || ball.y != startFanY) { // Check coordinates
        throw new Error(`Expected ball coordinates to be (${startFanX},${startFanY}), but got (${ball.x},${ball.y})`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) { // Check Vel
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan movement
addTest('South Fan Move Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x;
    startFanY = getObjectsByType("fan")[0].sprites[0].y+50;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 90;
    await sleep (500);

    // Check that it moved and has velocity
    if (ball.y <= startFanY) { // Check coordinates
        throw new Error(`Expected ball y to be greater than ${startFanY} but it is at ${ball.y}`);
    }
    if (ball.vel.y <= 0) { // Check vel
        throw new Error(`Expected ball.vel.y to be greater than ${0}, but got ${ball.vel.y}`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan's max distance (100)
addTest('South Fan Furthest Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x;
    startFanY = getObjectsByType("fan")[0].sprites[0].y+125;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 180;
    await sleep (500);

    // Check that it stayed still
    if (ball.x != startFanX || ball.y != startFanY) { // Check coordinates
        throw new Error(`Expected ball coordinates to be (${startFanX},${startFanY}), but got (${ball.x},${ball.y})`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) { // Check Vel
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan movement
addTest('West Fan Move Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x-50;
    startFanY = getObjectsByType("fan")[0].sprites[0].y;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 180;
    await sleep (500);

    // Check that it moved and has velocity
    if (ball.x >= startFanX) { // Check coordinates
        throw new Error(`Expected ball x to be greater than ${startFanX} but it is at ${ball.x}`);
    }
    if (ball.vel.x >= 0) { // Check vel
        throw new Error(`Expected ball.vel.x to be less than ${0}, but got ${ball.vel.x}`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan's max distance (100)
addTest('West Fan Furthest Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x-125;
    startFanY = getObjectsByType("fan")[0].sprites[0].y;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 180;
    await sleep (500);

    // Check that it stayed still
    if (ball.x != startFanX || ball.y != startFanY) { // Check coordinates
        throw new Error(`Expected ball coordinates to be (${startFanX},${startFanY}), but got (${ball.x},${ball.y})`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) { // Check Vel
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan movement
addTest('North Fan Move Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x;
    startFanY = getObjectsByType("fan")[0].sprites[0].y-50;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 270;
    await sleep (500);

    // Check that it moved and has velocity
    if (ball.y >= startFanY) { // Check coordinates
        throw new Error(`Expected ball y to be less than ${startFanY} but it is at ${ball.y}`);
    }
    if (ball.vel.y >= 0) { // Check vel
        throw new Error(`Expected ball.vel.y to be less than ${0}, but got ${ball.vel.y}`);
    }

    ball.vel = { x: 0, y: 0 };

});

// Test fan's max distance (100)
addTest('North Fan Furthest Test', async () => {
    startFanX = getObjectsByType("fan")[0].sprites[0].x;
    startFanY = getObjectsByType("fan")[0].sprites[0].y-125;
    ball.vel = { x: 0, y: 0 };
    ball.x = startFanX;
    ball.y = startFanY;
    getObjectsByType("fan")[0].sprites[0].rotation = 270;
    await sleep (500);

    // Check that it stayed still
    if (ball.x != startFanX || ball.y != startFanY) { // Check coordinates
        throw new Error(`Expected ball coordinates to be (${startFanX},${startFanY}), but got (${ball.x},${ball.y})`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) { // Check Vel
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }

    ball.vel = { x: 0, y: 0 };

});


addTest('Sound Load Test', async () => {
    const sounds = [hitSound, holeSound, waterSplash];

    for (const sound of sounds) {
        sound.play()
        if (sound === null) {
            throw new Error('Expected sound to be loaded but got null');
        }
        if (!(sound instanceof p5.SoundFile)) {
            throw new Error('Expected sound to be an instance of p5.SoundFile');
        }
    }
});

addTest('Trajectory Color Changing Logic', async () => {
    trajectoryColorSelector.value = "#ffffff";

    const event = new Event('change');
    trajectoryColorSelector.dispatchEvent(event);

    if(trajectoryColor != "#ffffff")
    {
        throw new Error("Trajectory color not changing")
    }
})

// Camera system has changed so this is no longer relevant
// addTest('Camera Moving', async () => {
//     cameraMode = "Follow";
//     draw();
//     if (camera.x != ball.x || camera.y != ball.y)
//         throw new Error('Camera position did not match ball position');
//     cameraMode = "Center";
// });

// Test that menu works
// Test only runs if it starts on 'menu' screen
// Needs keyPress simulation
// May want to make a second version that tests 'R' as well
/*addTest('Test restart', async () => {
    // Test only works if we start from gameOver screen
    if (gameState === 'gameOver'){
        // Simulate pressing 'r'

        await sleep(1000);
        if (gameState !== 0) throw new Error(`Expected gameState to be gameOver but got ${gameState} instead.`);
    }
});*/

/*
// All other tests should be placed before this one, as this one effectively ends the testing environemnt
addTest('Ball in Goal Logic', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = hole.x;
    ball.y = hole.y;
    await sleep(100);
    if (!ballInGoal) throw new Error('Expected ballInGoal to be true after moving into the hole');
});
*/

// Call this function to run all tests
// runTests();
