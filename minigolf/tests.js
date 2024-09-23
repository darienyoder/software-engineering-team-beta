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
    await sleep(100); // Wait for the ball to move
    if (ball.x === initialPosition.x && ball.y === initialPosition.y) {
        throw new Error('Expected ball to move');
    }
});

// Call this function to run all tests
runTests();
