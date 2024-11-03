var levelData = [
    {
        ballPosition: [75, 75],
        holePosition: [225, 75],
        area: `

            ADD rect 0, 0, 300, 150;

        `,
        obstacles: `
        `,
        par: 2,
    },
    {
        ballPosition: [75, 75],
        holePosition: [250, 75],
        area: `

            // Left side;
            ADD rect 0, 0, 150, 150;

            // Right side;
            {
                ADD rect 350, 0, 150, 250;
                SUB {
                    ADD circle 390, 165, 40;
                    ADD rect 350, 125, 40, 200;
                    ADD rect 390, 165, 40, 200;
                }
            }
            // Top arc;
            {
                ADD circle 250, 75, 150;
                SUB circle 250, 75, 100;
                SUB rect 0, 150, 500, 300;
                SUB rect 150, 75, 300, 300;
            }

            // Path to end;
            {
                ADD rect 0, 200, 150, 50;
                ADD oval 150, 150, 125, 100;
                SUB oval 150, 150, 75, 50;
                SUB rect 0, 0, 150, 200;
                SUB rect 0, 0, 225, 150;
            }

            // End goal;
            ADD circle 250, 75, 50;
            ADD rect 225, 75, 50, 75;

        `,
        obstacles: `
            ADD Sandtrap 250 -50 50 50;
            ADD Tubes 465 215 25 225;
            ADD Windmill 450 50;
        `,
        par: 5,
    },
    {
        ballPosition: [
          26,
          26
        ],
        holePosition: [
          46,
          286
        ],
        area: "ADD rect 21, 21, 50, 300;",
        obstacles: "ADD Windmill -16 146;",
        par: 5
    },
    {
        ballPosition: [
            100,
            20
        ],
        holePosition: [
            360, 28
        ],
        area: "ADD rect 0, 0, 390, 420;",
        obstacles:`

            ADD Windmill 380 80;

            // Left column of water;
            ADD Water 40 40;
            ADD Water 40 110;
            ADD Water 40 180;
            ADD Water 40 250;
            ADD Water 40 320;

            // Middle columns of water;
            ADD Water 160 40;
            ADD Water 160 110;
            ADD Water 160 180;
            ADD Water 160 250;
            ADD Water 160 270;

            ADD Water 230 40;
            ADD Water 230 110;
            ADD Water 230 180;
            ADD Water 230 250;
            ADD Water 230 270;

            // Right column of water;
            ADD Water 350 90;
            ADD Water 350 160;
            ADD Water 350 230;
            ADD Water 350 300;
            ADD Water 350 370;
            ADD Water 350 380;

            // Bottom row of water;
            ADD Water 40 380;
            ADD Water 110 380;
            ADD Water 180 380;
            ADD Water 250 380;
            ADD Water 300 380;
            `,
        par: 7
    }
];

const testLevel = {
    ballPosition: [75, 75],
    holePosition: [250, 75],
    area: `

        // Left side;
        ADD rect 0, 0, 150, 150;

        // Right side;
        {
            ADD rect 350, 0, 150, 250;
            SUB {
                ADD circle 390, 165, 40;
                ADD rect 350, 125, 40, 200;
                ADD rect 390, 165, 40, 200;
            }
        }
        // Top arc;
        {
            ADD circle 250, 75, 150;
            SUB circle 250, 75, 100;
            SUB rect 0, 150, 500, 300;
            SUB rect 150, 75, 300, 300;
        }

        // Path to end;
        {
            ADD rect 0, 200, 150, 50;
            ADD oval 150, 150, 125, 100;
            SUB oval 150, 150, 75, 50;
            SUB rect 0, 0, 150, 200;
            SUB rect 0, 0, 225, 150;
        }

        // End goal;
        ADD circle 250, 75, 50;
        ADD rect 225, 75, 50, 75;

    `,
    obstacles: `
        ADD Sandtrap 250 -50 50 50;
        ADD Tubes 465 215 25 225;
        ADD Windmill 450 50;
        ADD Water 460 40;
        ADD Volcano 50 75;
    `,
    par: 5,
}
