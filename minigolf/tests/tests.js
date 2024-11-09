const tests = []; // How is this working if it's constant?
                  // Like I know it is, but How?
                  // Do not think too hard about it, javascript is very weird

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


addTest('Initial Stroke Count', async () => {
    strokeCount = 0;
    if (strokeCount !== 0) throw new Error('Expected strokeCount to be 0');
});

addTest('Ball Movement', async () => {
    const initialPosition = { x: ball.x, y: ball.y };
    ball.applyForce(50, -50);
    await sleep(1000);
    if (ball.x === initialPosition.x && ball.y === initialPosition.y) {
        throw new Error('Expected ball to move');
    }
});

addTest('Ball Angle Bounce Test', async () => {
    function getBallAngle(ball) {
        const angleRadians = Math.atan2(ball.vel.y, ball.vel.x);
        const angleDegrees = angleRadians * (180 / Math.PI);
        return parseFloat(angleDegrees.toFixed(2));
    }

    ball.vel = { x: 0, y: 0 };
    ball.x = ball.y = 10;
    await sleep(50);

    ball.applyForce(50, -50);
    await sleep(50);
    let initAngle = getBallAngle(ball);

    await sleep(100);
    let finAngle = getBallAngle(ball);

    if ((finAngle * -1) !== initAngle) {
        throw new Error('Expected ball to move');
    }
    ball.vel = { x: 0, y: 0 };
});

addTest('Ball Drag Test', async () => {
    ball.vel = { x: (friction.trigger * 2), y: 0 };

    if (ball.drag !== friction.reg) {
        throw new Error(`Expected ball.drag to be ${friction.reg} when moving, but got ${ball.drag}`);
    }

    ball.vel = { x: (friction.trigger / 2), y: (friction.trigger / 2)}
    await sleep(50);

    if (ball.drag !== friction.slow) {
        throw new Error(`${ball.velocity} Expected ball.drag to be ${friction.slow} when velocity in trigger range, but got ${ball.drag}`);
    }
    ball.vel = { x: 0, y: 0 };
});

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

    if ((afterVel >= initVel / 3) || (afterVel >= initVel / 3)) {
        throw new Error(`Expected afterVel to be less than ${initVel/3} when in sandtrap, but got ${afterVel}`);
    }

    ball.vel = { x: 0, y: 0 };
});

addTest('Windmill Push Test', async () => {
    ball.vel = { x: 0, y: 0 };
    initialX = ball.velocity.x;
    initialY = ball.velocity.y;
    ball.x = getObjectsByType("windmill")[0].sprites[0].x -50;
    ball.y = getObjectsByType("windmill")[0].sprites[0].y -50;
    await sleep (2500)

    if (ball.x == initialX && ball.y == initialY) {
        throw new Error(`Expected ball to not be at ${initialX.x}, ${initialY.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel = { x: 0, y: 0 };
});

// Be careful because on some maps, tubes put the ball in goal
addTest('Tube Teleportation test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = getObjectsByType("tubes")[0].sprites[0].x;
    ball.y = getObjectsByType("tubes")[0].sprites[0].y;
    await sleep(300); // Wait for any animations
    if ((ball.x == getObjectsByType("tubes")[0].sprites[0].x) && (ball.y == getObjectsByType("tubes")[0].sprites[0].y)) {
        throw new Error(`Expected ball to not be at ${getObjectsByType("tubes")[0].sprites[0].x}, ${getObjectsByType("tubes")[0].sprites[0].y}, but it is at ${ball.x}, ${ball.y}`);
    }
    ball.vel = { x: 0, y: 0 };
});

addTest('Water Test', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = getObjectsByType("water")[0].sprites[0].x;
    ball.y = getObjectsByType("water")[0].sprites[0].y;
    initialX = ball.velocity.x
    await sleep (100)

    if (ball.x == getObjectsByType("water")[0].sprites[0].x && ball.y == getObjectsByType("water")[0].sprites[0].y && ball.x != lastHit.x && ball.y != lastHit.y) {
        throw new Error(`Expected ball to not be at ${lastHit.x}, ${lastHit.y}, but it is at ${getObjectsByType("water")[0].sprites[0].x}, ${getObjectsByType("water")[0].sprites[0].y}`);
    }
    ball.vel = { x: 0, y: 0 };
});

addTest('Volcano Test', async () => {
    ball.x = ballStart.x;
    ball.y = ballStart.y;
  
    ball.x = getObjectsByType("lava")[0].sprites[0].x; // Currently broken
    ball.y = getObjectsByType("lava")[0].sprites[0].y; // It says volcano is undefined
    await sleep (600)

    if (ball.x != ballStart.x || ball.y != ballStart.y) {
        throw new Error(`Expected ball to be at ${ballStart.x}, ${ballStart.y}, but it is at ${ball.x}, ${ball.y}`);
    }
    if (ball.vel.x != 0 || ball.vel.y != 0) {
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

addTest('Camera Moving', async () => {
    cameraMode = "Follow";
    draw();
    if (camera.x != ball.x || camera.y != ball.y)
        throw new Error('Camera position did not match ball position');
    cameraMode = "Center";
});

// All other tests should be placed before this one, as this one effectively ends the testing environemnt
addTest('Ball in Goal Logic', async () => {
    ball.vel = { x: 0, y: 0 };
    ball.x = hole.x;
    ball.y = hole.y;
    await sleep(100);
    if (!ballInGoal) throw new Error('Expected ballInGoal to be true after moving into the hole');
});

// Call this function to run all tests
// runTests();
