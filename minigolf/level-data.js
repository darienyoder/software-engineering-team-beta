var levelData = [
    {
        ballPosition: [50, 75],
        holePosition: [250, 75],
        area: `

            ADD rect 0, 0, 300, 150;
            // HEIGHT + 6: hill -100, 75, 500, 500;
            HEIGHT + -3: hill 280, 120, 50, 50;
            HEIGHT = 01134: oval 150, 75, 70, 70;
            HEIGHT = 0: oval 150, 75, 50, 50;
            HEIGHT + -3: hill 150, 75, 50, 50;
            HEIGHT = 843: oval 250, 15, 40, 25;

            // HEIGHT = 3: line 0, 0, 300, 150, 50;

            // HEIGHT = 3: ramp (x1, y1), (x2, y2), width;
            // HEIGHT + 3: rect x, y, h, w;

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
};
