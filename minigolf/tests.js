const tests = [];

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

// All other tests should be placed before this one, as this one effectively ends the testing environemnt
addTest('Ball in Goal Logic', async () => {
    //The following lines are a teleport
    ball.x = hole.x;
    ball.y = hole.y;
    await sleep(100); // Wait for any animations
    if (!ballInGoal) throw new Error('Expected ballInGoal to be true after moving into the hole');
});


// Call this function to run all tests
runTests();
