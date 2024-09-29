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
addTest('Test Menu', async () => {
    // Test only works if we start from menu screen
    if (gameState === 'menu'){
        const element = document.querySelector('input');
        element.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));


        await sleep(1000);
        if (gameState !== 0) throw new Error(`Expected gameState to be  but got ${gameState} instead.`);
    }
});


// Example Tests
addTest('Initial Stroke Count', async () => {
    strokeCount = 0;
    if (strokeCount !== 0) throw new Error('Expected strokeCount to be 0');
});

addTest('Ball Movement', async () => {
    const initialPosition = { x: ball.x, y: ball.y };
    ball.applyForce(50, 50); // Simulating a force
    await sleep(1000); // Wait for the ball to move
    if (ball.x === initialPosition.x && ball.y === initialPosition.y) {
        throw new Error('Expected ball to move');
    }
});

// Add this test to your existing tests array
addTest('Ball Drag Test', async () => {
    ball.velocity.x = 0.3; // Set a velocity greater than 0.2

    // Check the drag value
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


// Test that the windmill works
addTest('Windmill Push Test', async () => {
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    initialX = ball.velocity.x;
    initialY = ball.velocity.y;
    ball.x = windmillBody.x -20;
    ball.y = windmillBody.y +10;
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
    //The following lines are a teleport
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
    lastHit = createVector(50, 75); // This may need to be changed if it's a position off map.
    ball.x = water.x;
    ball.y = water.y;
    initialX = ball.velocity.x
    await sleep (100)
    // ball.velocity.x = 0.2; // velocity that triggers high drag

    // Check both that it's not at the water and is at lastHit
    if (ball.x == water.x && ball.y == water.y && ball.x != lastHit.x && ball.y != lastHit.y) {
        throw new Error(`Expected ball to not be at ${lastHit.x}, ${lastHit.y}, but it is at ${ball.x}, ${ball.y}`);
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


// Call this function to run all tests
runTests();
