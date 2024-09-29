const tests = []; // How is this working if it's constant?
                  // Like I know it is, but How?

function addTest(name, testFunction) {
    tests.push({ name, testFunction });
}

async function runTests() {
    let allPassed = true;
    for (const test of tests) {
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
    } else {
        console.log('Some tests failed. Check above for details.');
    }
}

// Test that menu works
// Test only runs if it starts on 'menu' screen
// Needs keyPress simulation
/*addTest('Test Menu', async () => {
    // Test only works if we start from menu screen
    if (gameState === 'menu'){
        // Simulate pressing 'Enter'

        await sleep(1000);
        if (gameState !== 0) throw new Error(`Expected gameState to be playing but got ${gameState} instead.`);
    }
});*/


// Example Tests
addTest('Initial Stroke Count', async () => {
    strokeCount = 0;
    if (strokeCount !== 0) throw new Error('Expected strokeCount to be 0');
});

addTest('Ball Movement', async () => {
    const initialPosition = { x: ball.x, y: ball.y };
    ball.applyForce(50, -50); // Simulating a force
    await sleep(1000); // Wait for the ball to move
    if (ball.x === initialPosition.x && ball.y === initialPosition.y) {
        throw new Error('Expected ball to move');
    }
});

// Add this test to your existing tests array
addTest('Ball Drag Test', async () => {
    ball.velocity.x = 0.3; // Set a velocity greater than 0.2

    // Check the drag value
    // May also want to check that it's not in a sandtrap here
    if (ball.drag === 2) {
        throw new Error(`Expected ball.drag to not be 2 when moving, but got ${ball.drag}`);
    }
    await sleep (1500)
    // ball.velocity.x = 0.2; // velocity that triggers high drag

    // Check the drag value
    if (ball.drag !== 2) {
        throw new Error(`${ball.velocity} Expected ball.drag to be 2 when velocity in trigger range, but got ${ball.drag}`);
    }
});


// Test the Sand
addTest('Sand test', async () => {
    ball.vel.x = 0;
    ball.vel.y = 0;
    ball.x = sandtrap.x - 40;
    ball.y = sandtrap.y + 5;
    
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
    ball.vel.x = 0;
    ball.vel.y = 0;
});


// Test that the windmill works
addTest('Windmill Push Test', async () => {
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    initialX = ball.velocity.x;
    initialY = ball.velocity.y;
    ball.x = windmillBody.x -50;
    ball.y = windmillBody.y -50;
    await sleep (2500)
    // ball.velocity.x = 0.2; // velocity that triggers high drag

    // Check the drag value
    if (ball.x == initialX && ball.y == initialY) {
        throw new Error(`Expected ball to not be at ${initialX.x}, ${initialY.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel.x = 0;
    ball.vel.y = 0;
});


// Test that the tubes work as expected
// Be careful because on some maps, tubes put the ball in goal  
addTest('Tube Teleportation test', async () => {
    ball.vel.x = 0;
    ball.vel.y = 0;
    ball.x = tubeA.x;
    ball.y = tubeA.y;
    await sleep(1000); // Wait for any animations
    if ((ball.x == tubeA.x) && (ball.y == tubeA.y)) {
        throw new Error(`Expected ball to not be at ${tubeA.x}, ${tubeA.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel.x = 0;
    ball.vel.y = 0;
});


// Test the water
addTest('Water Test', async () => {
    ball.vel.x = 0;
    ball.vel.y = 0;
    ball.x = water.x;
    ball.y = water.y;
    initialX = ball.velocity.x
    await sleep (100)

    // Check both that it's not at the water and is at lastHit
    if (ball.x == water.x && ball.y == water.y && ball.x != lastHit.x && ball.y != lastHit.y) {
        throw new Error(`Expected ball to not be at ${lastHit.x}, ${lastHit.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel.x = 0;
    ball.vel.y = 0;
});


// Test the volcano
addTest('Volcano Test', async () => {
    ball.x = ballStart.x;
    ball.y = ballStart.y;
    ball.vel.x = 5;
    await sleep (300)

    // Check both that it's not at the water and is at lastHit
    if (ball.x != ballStart.x || ball.y != ballStart.y) {
        throw new Error(`Expected ball to be at ${ballStart.x}, ${ballStart.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) {
        throw new Error(`Expected ball.vel to be (0,0), but it got (${ball.vel.x},${ball.vel.y})`);
    }
    
    ball.vel.x = 0;
    ball.vel.y = 0;
});


// All other tests should be placed before this one, as this one effectively ends the testing environemnt
addTest('Ball in Goal Logic', async () => {
    ball.vel.x = 0;
    ball.vel.y = 0;
    //The following lines are a teleport
    ball.x = hole.x;
    ball.y = hole.y;
    await sleep(100); // Wait for any animations
    if (!ballInGoal) throw new Error('Expected ballInGoal to be true after moving into the hole');
});


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


// Call this function to run all tests
runTests();
