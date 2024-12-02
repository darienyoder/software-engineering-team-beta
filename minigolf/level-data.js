var levelData = [
    {
        ballPosition: [50, 75],
        holePosition: [250, 75],
        area: `
            ADD rect 0, 0, 300, 150;
        `,
        obstacles: `
        `,
        par: 1,
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

            // Sand;
            HEIGHT = 1134: rect 225, -75, 50, 50;
        `,
        obstacles: `
            // ADD Sandtrap 250 -50 50 50;
            ADD Tubes 465 215 25 225;
            ADD Windmill 450 50;
        `,
        par: 5,
    },
    {
        ballPosition: [
          46,
          26
        ],
        holePosition: [
          46,
          286
        ],
        area: `
        ADD rect 21, 21, 50, 300;
        HEIGHT = 1134: oval 25, 25, 16, 16;
        `,
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
        area: `
        ADD rect 0, 0, 390, 420;
        HEIGHT = -843: rect -5, -5, 85, 350;
        HEIGHT = -843: rect -5, 340, 400, 80;
        HEIGHT = -843: rect 310, 50, 80, 300;
        HEIGHT = -843: rect 122, -5, 145, 310;
        `,
        obstacles:`

            // Left column of water;
            // ADD Water 40 40;
            // ADD Water 40 110;
            // ADD Water 40 180;
            // ADD Water 40 250;
            // ADD Water 40 320;

            // Middle columns of water;
            // ADD Water 160 40;
            // ADD Water 160 110;
            // ADD Water 160 180;
            // ADD Water 160 250;
            // ADD Water 160 270;

            // ADD Water 230 40;
            // ADD Water 230 110;
            // ADD Water 230 180;
            // ADD Water 230 250;
            // ADD Water 230 270;

            // Right column of water;
            // ADD Water 350 90;
            // ADD Water 350 160;
            // ADD Water 350 230;
            // ADD Water 350 300;
            // ADD Water 350 370;
            // ADD Water 350 380;

            // Bottom row of water;
            // ADD Water 40 380;
            // ADD Water 110 380;
            // ADD Water 180 380;
            // ADD Water 250 380;
            // ADD Water 300 380;
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
            HEIGHT = 1134: rect 100, -21, 100, 50;

            // Middle section;
            ADD rect 0, 200, 300, 50;
            ADD circle 150, 200, 70, 70;
            // ADD rect 113, 110, 75, 75;
            HEIGHT = -843: rect 80, 100, 150, 100;

            // Bottom section;
            ADD rect 0, 400, 300, 50;

        `,
        obstacles: `

            ADD Tubes 275 25 25 225;
            ADD Tubes 275 225 25 425;
            // ADD Sandtrap 150 3 100 50;
            ADD Windmill 150 170;
            // ADD Water 150 150;

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
    area: `
    ADD rect 0, 0, 420, 420;

    // borders;
    HEIGHT = 1134: rect 0, 0, 20, 420;
    HEIGHT = 1134: rect 395, 0, 25, 420;
    HEIGHT = 1134: rect 0, 0, 420, 25;
    HEIGHT = 1134: rect 0, 390, 420, 30;

    // sand above the ball by the circle portal;
    HEIGHT = 1134: rect 0, 65, 152, 160;

    // sand to the right;
    HEIGHT = 1134: rect 50, 330, 350, 70;
    HEIGHT = 1134: rect 50, 245, 130, 65;

    // sand leading to the hole;
    HEIGHT = 1134: rect 180, 70, 195, 240;
    HEIGHT = 1134: rect 180, 0, 110, 100;
    `,
    obstacles:`

        //this sandtrap is left to slow the ball down before entering the hole;
          ADD Sandtrap 310 50 50 50;

          //borders;
           // ADD Sandtrap 15 210 20 410;

           // ADD Sandtrap 405 210 20 410;

           // ADD Sandtrap 210 15 410 20;

           // ADD Sandtrap 210 405 410 25;

          //inner part of maze;
          //first colums to the right;
          // ADD Sandtrap 90 360 80 70;
          // ADD Sandtrap 115 275 130 70;
          // coloums on the right that lead up to the hole;
          // ADD Sandtrap 262 360 265 70;
          // ADD Sandtrap 278 190 200 240;
          //  ADD Sandtrap 256 60 156 70;
          // colum right above the ball by the circle portal;
          // ADD Sandtrap 85 145 152 160;
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
    {
        ballPosition: [0, 50],
        holePosition: [0, 550],
        area: `
        ADD poly (0, 0), (200, 300), (0, 600), (-200, 300);
        HEIGHT + -1: hill 50, 100, 60, 50;
        HEIGHT = -843: oval 50, 100, 10, 10;
        HEIGHT + 1: hill -90, 160, 80, 70;
        HEIGHT + 1: hill 100, 230, 90, 70;
        HEIGHT + -1: hill -120, 300, 80, 60;
        HEIGHT = -843: oval -120, 300, 10, 10;
        HEIGHT + 1: hill -80, 430, 110, 80;
        HEIGHT + -1: hill 100, 380, 80, 70;
        HEIGHT = -843: oval 100, 380, 10, 10;
        HEIGHT = 1134: oval 0, 300, 20, 20;
        `,
        obstacles: `
        `,
        par: 10,
    },
    {
        ballPosition: [35, 220],
        holePosition: [350, -115],
        area: `
            //middle horizontal piece;
             ADD rect 0, 0, 220, 70;
             //bottom vertical peice;
             ADD rect 0, 50, 70, 200;
             //rightvertical piece;
             ADD rect 150, 0, 70, -150;

             //top right horizontal piece;
             ADD rect 150, -150, 230, 70;

             //water in the course ;
             HEIGHT = -843: oval 10, 10, 42, 37;
             HEIGHT = -843: oval 58, 150, 30, 35;
             HEIGHT = -843: oval 195, 54, 39, 34;
             HEIGHT = -843: oval 165, -140, 40, 35;
             HEIGHT = -843: oval 290, -80, 35, 30;
        `,
        obstacles:`


        `,
        par:4
    },
    {
        ballPosition: [250, 50],
        holePosition: [250, 230],
        area: `
            ADD rect 0, 0, 350, 300;
            HEIGHT + 1: hill 350, 170, 60, 100;
            HEIGHT + 1: hill 90, 50, 60, 60;
            HEIGHT + -1: hill 0, 300, 60, 60;
            HEIGHT = -843: oval 200, 150, 100, 50;
            HEIGHT = -843: oval 0, 300, 20, 20;
            HEIGHT = 1134: rect 100, 250, 100, 50;
        `,
        obstacles:`
            ADD Volcano 300 220;
            ADD Rock 40 175;
        `,
        par:3
    },
    { // Darien.2 - "Shortcut"
        ballPosition: [30, 100],
        holePosition: [270, 170],
        area: `
            // Level boundary;
            ADD rect 0, 0, 300, 200;

            // Sand at center;
            HEIGHT = 01134: rect 180, 60, 60, 140;
            HEIGHT = 01134: rect 120, 150, 60, 50;
            HEIGHT = 0: oval 110, 145, 60, 50;
            HEIGHT = 01134: line 190, 200, 210, 60, 30;

            // Sand on left side;
            HEIGHT = 01134: rect 0, 0, 100, 100;
            HEIGHT = 0: oval 15, 100, 45, 20;
            HEIGHT = 01134: oval 95, 100, 35, 30;
            HEIGHT = 01134: line 100, 100, 110, 0, 30;

            // Upper part on the right side;
            HEIGHT + 0.2: ramp 180, 30, 240, 30, 30;
            HEIGHT = 0.2: rect 240, 0, 80, 200;

            // Wall against ramp;
            SUB rect 180, 60, 60, 1;
        `,
        obstacles: `
        `,
        par: 3,
    },
    {
        // Circular Hilly Level
        ballPosition: [300, 525],
        holePosition: [300, 300],
        area: `

            ADD circle 300, 300, 200;
            SUB circle 300, 100, 125;
            SUB rect 0, 70, 500, 80;
            ADD rect 250, 450, 100, 120;

            // Comment this section for lake;
            // SUB oval 300, 400, 100, 40;
            // SUB rect 200, 360, 200, 40;

            // Comment this section for cutout area;
            HEIGHT + 1: hill 300, 400, 60, 60;
            HEIGHT = -843: oval 300, 370, 75, 25;


            HEIGHT + 1: hill 300, 200, 90, 60;
            HEIGHT + 1: hill 400, 300, 60, 60;
            HEIGHT + 1: hill 200, 300, 60, 60;
        `,
        obstacles: `
            ADD Windmill 120 400;
            ADD Windmill 480 400;
        `,
        par: 4
    },
    { // Plinko
        ballPosition: [50, 25],
        holePosition: [270, 720],
        area: `
            ADD rect 0, 0, 300, 750;
            ADD rect 300, 200, 150, 150;

            SUB rect 60, 700, 10, 50;
            SUB rect 130, 700, 10, 50;
            SUB rect 230, 700, 10, 50;
            HEIGHT = -1: ramp 150, 75, 150, 700, 300;
            HEIGHT = -1: rect 0, 700, 300, 60;
            HEIGHT = -843: oval 185, 750, 50, 50;

            SUB poly (75, 399), (165, 450), (50, 499);
        `,
        obstacles: `
        ADD Rock 62 318;
        ADD Rock 290 275;
        ADD Rock 236 157;
        ADD Rock 39 141;
        ADD Rock 67 241;
        ADD Rock 45 603;
        ADD Rock 157 499;
        ADD Rock 136 192;
        ADD Rock 241 586;
        ADD Rock 49 520;
        ADD Rock 270 496;
        ADD Rock 251 355;
        ADD Rock 153 310;
        ADD Rock 234 433;
        ADD Rock 125 567;
        ADD Windmill 100 675;
        ADD Windmill 177 235;
        ADD Tubes 400 300 25 270;
        ADD Tubes 30 720 25 25;
        ADD Volcano 350 270;
        `,
        par: 5,
    },
    {
        ballPosition: [25, 150],  
        holePosition: [20,25], 
        area: `
             //the corse and the rects the cut the middle out;
            ADD rect 0, 0, 300, 300;
            SUB rect 50, 50, 200, 200;
            SUB rect 0, 50, 100, 75;
            
            //the ramp at the bottom;
            HEIGHT + .5: ramp 250, 270, 5, 270, 27;
            HEIGHT = 0.5: rect 5, 130, 50, 170;
            //water at the bottom;
            HEIGHT = -843: oval 290, 285, 13, 15; 
            HEIGHT = -843: oval 290, 15, 13, 15; 
        
        `,
        obstacles:`
         ADD Windmill 150 91;
            
        `,
        par:3
    },
    {
        // Banana Level
        ballPosition: [30, 450],
        holePosition: [96, -430],
    
        area: `
        add oval 0, 0, 250, 500;
        sub oval 0, -100, 100, 520;
        sub rect -330, -500, 330, 1200;

        HEIGHT = -843: oval 270, 100, 85, 40;
        HEIGHT = -843: oval 130, -250, 30, 30;
        HEIGHT = -843: oval 70, 90, 50, 108;

        HEIGHT = 1134: oval 110, 260, 30, 50;
        HEIGHT = 1134: oval 79, -400, 40, 15;

        HEIGHT + .8: hill 160, 0, 30, 25;
        HEIGHT - .3: hill 110, -350, 24, 40;
        `,
        obstacles: `
            ADD Windmill 176 400;
            ADD Windmill 170 -100;
        `,
        par: 5
},
  {
        ballPosition: [-60, 375],
        holePosition: [0, -70],
        area: `
        ADD rect -40, -100, 80, 500;
        ADD rect -80, 350, 160, 50;
        ADD circ 0, -50, 100, 100;

        ADD circ 60, 275, 50, 50;
        ADD rect 0, 225, 60, 100;

        ADD circ -60, 125, 50, 50;
        ADD rect -60, 75, 50, 100;

        ADD rect -80, 250, 50, 50;
        HEIGHT = -843: rect -80, 250, 40, 50;
        
        ADD rect 40, 100, 40, 50;
        HEIGHT = -843: rect 40, 100, 40, 50;
        `,
        obstacles: `
        ADD Fan 0 0 1;
        ADD Fan 60 275 2;
        ADD Fan -60 125 0;
        `,
        par: 8
    },
    {
        ballPosition: [30, 585],
        holePosition: [50, 40],
        area: `
        ADD rect 0, 0, 100, 625;
        HEIGHT + 1: ramp 0, 500, 0, 100, 100;
        HEIGHT = 1: rect 0, 0, 100, 100;
        HEIGHT = -843: oval -20, 450, 60, 100;
        `,
        obstacles: `
        ADD Fan 80 600 3;
        ADD Fan 20 320 3;
        ADD Fan 80 220 3;
        `,
        par: 1 //Yes, this is possible to do in 1
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

        // Fan area;
        {
            ADD rect 520, 200, 450, 50;
            ADD rect 720, 0, 50, 450;
        }

        `,
        obstacles: `
        ADD Sandtrap 250 -50 50 50;
        ADD Tubes 465 215 25 225;
        ADD Windmill 425 45;
        ADD Water 460 40;
        ADD Volcano 50 75;
        ADD Fan 745 225 0;
    `,
    par: 5,
};
