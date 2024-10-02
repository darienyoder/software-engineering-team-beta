
// // Returns true if the given areas' contents are equal
// function compareAreas(area_1, area_2)
// {
//     if (area_1[0].length != area_2[0].length || area_1[1].length != area_2[1].length)
//         return false;

//     for (var i = 0; i < area_1[0].length; i++)
//         if (area_1[0].X != area_2[0].X || area_1[0].Y != area_2[0].Y)
//             return false;

//     for (var i = 0; i < area_1[1].length; i++)
//         if (area_1[1].X != area_2[1].X || area_1[1].Y != area_2[1].Y)
//             return false;

//     return true;
// }

// // Creates a single rectangle and makes sure
// // that all vertices of the resulting polygon
// // are in their expected positions
// addTest('LevelGen Basic Rect', async () => {

//     for (var x = 0; x < 10; x++)
//     for (var y = 0; y < 10; y++)
//     for (var w = 1; w < 10; w++) // Minimum width and height of 1
//     for (var h = 1; h < 10; h++) // Otherwise, there'd be no area
//     {
//         // Ex. "ADD rect 3, 5, 7, 6;"
//         let testArea = parseAreaString("ADD rect " + String(x) + " " + String(y) + " " + String(w) + " " + String(h) + ";")
//         if (!compareAreas(testArea, [[[
//             {"X": x, "Y": y},
//             {"X": x + w, "Y": y},
//             {"X": x + w, "Y": y + h},
//             {"X": x, "Y": y + h}
//         ]], []]))
//             {
//                 throw new Error("ADD rect " + String(x) + " " + String(y) + " " + String(w) + " " + String(h) + ";");
//             }
//     }
// });

// // Creates two overlapping rectangles and
// // makes sure that the resulting polygon
// // is shaped as expected
// //
// //  +-------+
// //  |       |
// //  |       +---+
// //  |           |
// //  +---+       |
// //      |       |
// //      +-------+
// //
// addTest('LevelGen Shape Addition', async () => {

//     for (var x1 = 0; x1 < 1; x1++)
//     for (var y1 = 0; y1 < 1; y1++)
//     for (var w1 = 1; w1 < 10; w1++)
//     for (var h1 = 1; h1 < 10; h1++)
//     for (var x2 = x1 + 1; x2 < x1 + w1; x2++)
//     for (var y2 = y1 + 1; y2 < x2 + h2; y2++)
//     for (var w2 = 20; w2 < 30; w2++)
//     for (var h2 = 20; h2 < 30; h2++)
//     {
//         // Ex. ADD rect 3, 5, 7, 6; ADD rect 5, 9, 23, 28;"
//         let testArea = parseAreaString(
//         "ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//         + "ADD rect" + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";"
//     )
//         if (!compareAreas(testArea, [[[
//             {"X": x1, "Y": y1},
//             {"X": x1 + w1, "Y": y1},
//             {"X": x1 + w1, "Y": y2},
//             {"X": x2 + w2, "Y": y2},
//             {"X": x2 + w2, "Y": y2 + h2},
//             {"X": x2, "Y": y2 + h2},
//             {"X": x2, "Y": y1 + h1},
//             {"X": x1, "Y": y1 + h1},
//         ]], []]))
//             {
//                 throw new Error("ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//                               + "ADD rect" + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";");
//             }
//     }
// });

// // Subtracts one rectangle from another and
// // makes sure that the resulting polygon
// // is shaped as expected
// //
// //  +-------+
// //  |       |
// //  |   +---+
// //  |   |
// //  +---+
// //
// addTest('LevelGen Shape Subtraction', async () => {

//     for (var x1 = 0; x1 < 1; x1++)
//     for (var y1 = 0; y1 < 1; y1++)
//     for (var w1 = 1; w1 < 5; w1++)
//     for (var h1 = 1; h1 < 5; h1++)
//     for (var x2 = x1 + 1; x2 < x1 + w1; x2++)
//     for (var y2 = y1 + 1; y2 < y1 + h1; y2++)
//     for (var w2 = 20; w2 < 21; w2++)
//     for (var h2 = 20; h2 < 21; h2++)
//     {
//         // Ex. ADD rect 3, 5, 7, 6; SUB rect 5, 9, 23, 28;"
//         let testArea = parseAreaString(
//         "ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//         + "SUB rect " + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";"
//     )
//         if (!compareAreas(testArea, [[[
//             {"X": x1, "Y": y1},
//             {"X": x1 + w1, "Y": y1},
//             {"X": x1 + w1, "Y": y2},
//             {"X": x2, "Y": y2},
//             {"X": x2, "Y": y1 + h1},
//             {"X": x2, "Y": y1 + h1},
//             {"X": x1, "Y": y1 + h1},
//         ]], []]))
//             {
//                 throw new Error("ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//                               + "SUB rect " + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";");
//             }
//     }
// });

// // Subtracts a rectangle from inside another and
// // makes sure that the resulting polygons
// // are shaped as expected
// //
// //  +-------+
// //  | +---+ |
// //  | |   | |
// //  | +---+ |
// //  +-------+
// //
// addTest('LevelGen Donut', async () => {

//     for (var x1 = 0; x1 < 10; x1++)
//     for (var y1 = 0; y1 < 10; y1++)
//     for (var w1 = 3; w1 < 10; w1++)
//     for (var h1 = 3; h1 < 10; h1++)
//     for (var x2 = x1 + 1; x2 < x1 + w1 - 2; x2++)
//     for (var y2 = y1 + 1; y2 < y1 + h1 - 2; y2++)
//     for (var w2 = 1; w2 < w1 - x2; w2++)
//     for (var h2 = 1; h2 < h1 - y2; h2++)
//     {
//         // Ex. ADD rect 3, 5, 7, 6; SUB rect 6, 8, 3, 2;"
//         let testArea = parseAreaString(
//         "ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//         + "SUB rect " + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";"
//     )
//         if (!compareAreas(testArea, [[[
//             {"X": x1, "Y": y1},
//             {"X": x1 + w1, "Y": y1},
//             {"X": x1 + w1, "Y": y1 + h1},
//             {"X": x1, "Y": y1 + h1}
//         ]], [[
//             {"X": x2, "Y": y2},
//             {"X": x2 + w2, "Y": y2},
//             {"X": x2 + w2, "Y": y2 + h2},
//             {"X": x2, "Y": y2 + h2}
//         ]]]))
//             {
//                 throw new Error("ADD rect " + String(x1) + " " + String(y1) + " " + String(w1) + " " + String(h1) + ";"
//                               + "SUB rect " + String(x2) + " " + String(y2) + " " + String(w2) + " " + String(h2) + ";");
//             }
//     }
// });

// // Tests order of operations using curly brackets
// addTest('LevelGen Brackets', async () => {

//     // The SUB statement should not affect the ADD statement outside the brackets
//     let testArea = cleanPolygons(parseAreaString(`
//         ADD rect 0, 0, 5, 10;
//         {
//             ADD rect 6, 0, 9, 10;
//             SUB rect 0, 0, 10, 10;
//         }
//     `));

//     if (!compareAreas(testArea, [[
//         [
//             {"X": 0, "Y": 0},
//             {"X": 5, "Y": 0},
//             {"X": 5, "Y": 10},
//             {"X": 0, "Y": 10}
//         ],
//         [
//             {"X": 10, "Y": 0},
//             {"X": 15, "Y": 0},
//             {"X": 15, "Y": 10},
//             {"X": 10, "Y": 10}
//         ],
//         ], []]))
//         {
//             console.log(testArea);
//             throw new Error("Brackets did not group statements correctly.");
//         }
// });
