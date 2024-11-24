var levelData = [
    {
        ballPosition: [50, 25],
        holePosition: [270, 720],
        area: `
            ADD rect 0, 0, 300, 750;
            ADD rect 300, 200, 150, 150;

            SUB rect 60, 700, 10, 50;
            SUB rect 130, 700, 10, 50;
            SUB rect 230, 700, 10, 50;
            HEIGHT = -843: oval 185, 750, 50, 50; 
            HEIGHT = 1, 0, 75, 0, 700, 300;

            SUB poly (75, 399), (165, 450), (50, 499);
        `,
        obstacles: `
        ADD Windmill 100 675;
        ADD Windmill 177 235;
        ADD Tubes 400 300 25 270;
        ADD Tubes 30 720 25 25;
        ADD Volcano 350 270; 
        ADD Rock 153 302;
        ADD Rock 103 477;
        ADD Rock 133 436;
        ADD Rock 174 442;
        ADD Rock 150 462;
        ADD Rock 153 417;
        ADD Rock 197 337;
        ADD Rock 163 349;
        ADD Rock 180 453;
        ADD Rock 194 343;
        `,
        par: 5,
    },
    {
        ballPosition: [50, 75],
        holePosition: [250, 75],
        area: `
            ADD rect 0, 0, 300, 150;
            ADD rect 75, 150, 150, 300;
            ADD rect 0, 225, 300, 150;
        `,
        obstacles: `
        ADD Fan 150 150 90;
        ADD Fan 300 300 180;
        ADD Fan 150 450 270;
        ADD Fan 0 300 0;
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
    },
    {
        ballPosition: [20, 25],
        holePosition: [275, 425],
        area: `

            // Top section;
            ADD rect 0, 0, 300, 50;
            ADD rect 100, -25, 100, 30;

            // Middle section;
            ADD rect 0, 200, 300, 50;
            ADD circle 150, 200, 70, 70;
            ADD rect 113, 110, 75, 75;

            // Bottom section;
            ADD rect 0, 400, 300, 50; 

        `,
        obstacles: `
        
            ADD Tubes 275 25 25 225;
            ADD Tubes 275 225 25 425;
            ADD Sandtrap 150 3 100 50;
            ADD Windmill 150 170;
            ADD Water 150 150;

        `,
        par: 3
    },
    {
        ballPosition: [-130,50],
        holePosition: [150,50],
        area: `
            
                // Outside ring;
                ADD circ 150, 50, 300;
                SUB circ 150, 50, 250;
                // path from outside ring to inside ring;
                ADD rect -100, 0, 100, 100;
                // inside ring;
                ADD circ 150, 50, 200;
                SUB circ 150, 50, 150;
                // path to hole circle form inide ring;
                ADD rect 225, 0, 100, 100;
                // hole circle;
                ADD circ 150, 50, 100;
             
        `,
        obstacles: `
            ADD Sandtrap 80 50 10 50;
            // sandtrap is underneath tubeB, used to slow ball down so it enters hole;
            ADD Tubes 425 50 75 50; 
            ADD Windmill 150 -180;
            ADD Windmill 150 280;
        `,
        par: 3
    },
    {
      ballPosition: [
        38,
        375
    ],
    holePosition: [
        358, 48
    ],
    area: "ADD rect 0, 0, 420, 420;",
    obstacles:`
          //borders;
          ADD Sandtrap 15 210 20 410;

          ADD Sandtrap 405 210 20 410;

          ADD Sandtrap 210 15 410 20;

          ADD Sandtrap 210 405 410 20;

          //inner part of maze;
          //first colums to the right;
          ADD Sandtrap 90 360 80 70;
          ADD Sandtrap 115 275 130 70;
          // coloums on the right that lead up to the hole;
          ADD Sandtrap 262 360 265 70;
          ADD Sandtrap 278 190 200 240;
          ADD Sandtrap 256 60 156 70;
          // colum right above the ball by the circle portal;
          ADD Sandtrap 85 145 152 160;
          //the portals;
          ADD Tubes 35 45 310 50; 
        `,
        par: 3,
    },
    {
        //Ghost level;
        ballPosition: [150, 25],
        holePosition: [150, 600],
        area: `

            // Top section;
            ADD rect 0, 0, 300, 700;
            ADD rect 100, -50, 100, 50;
            SUB rect 0, 350, 125, 50;
            SUB rect 175, 350, 125, 50;

        `,
        obstacles: `
            ADD Ghost 150 0;
            ADD Button 150 375;
            ADD Rock 250 450;
            ADD Rock 50 450;
            ADD Rock 150 500;
            ADD Rock 250 550;
            ADD Rock 50 550;
        `,
        par: 3
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
        ADD Windmill 425 45;
        ADD Water 460 30;
        ADD Volcano 50 75;
    `,
    par: 5,
};

