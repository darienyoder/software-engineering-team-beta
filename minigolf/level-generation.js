const levelMargin = 50; // Number of pixels between the level's edge and the edge of the window
const wallThickness = 7; // Width of the outer walls

const floorColor = "#408040";
const backgroundColor = "#f2ece3";
const wallColor = "#684917";

const ADD = 0;
const SUBTRACT = 1;
const SUB = 1;

var levelPolytree = new ClipperLib.PolyTree(); // Tree used for clipping polygons

var positiveWalls = []; // Polygons that add to the level area
var negativeWalls = []; // Holes in the level area

var clipper = new ClipperLib.Clipper();

function createWallSegment(fromVector, toVector)
{
    let newWall = new Sprite((fromVector.x + toVector.x) / 2.0, (fromVector.y + toVector.y) / 2.0, fromVector.dist(toVector), wallThickness);
    newWall.rotation = createVector(1, 0).angleBetween( toVector.sub(fromVector) );
    newWall.strokeWeight = 0.0;
    newWall.color = wallColor;
    newWall.collider = "static";
}

// Adds or subtracts shapes from the current level area
// newShape = {operation (ADD or SUB), polygon (list of points)}
function modifyLevelShape(newShape)
{
    if (newShape.operation == ADD)
    {
        clipper.AddPaths(positiveWalls, ADD, true);
        clipper.AddPath(newShape.polygon, ADD, true);
        clipper.Execute(ClipperLib.ClipType.ctUnion, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        positiveWalls = [];
        let polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
            {
                negativeWalls.push(polynode.Contour());
            }
            else
            {
                positiveWalls.push(polynode.Contour());
            }
            polynode = polynode.GetNext();
        }

        clipper.AddPaths(negativeWalls, ADD, true);
        clipper.AddPath(newShape.polygon, SUBTRACT, true);
        clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        negativeWalls = [];
        polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                positiveWalls.push(polynode.Contour().reverse());
            else
                negativeWalls.push(polynode.Contour().reverse());
            polynode = polynode.GetNext();
        }
    }
    else
    {
        clipper.AddPaths(negativeWalls, ADD, true);
        clipper.AddPath(newShape.polygon, ADD, true);
        clipper.Execute(ClipperLib.ClipType.ctUnion, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        negativeWalls = [];
        let polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                positiveWalls.push(polynode.Contour().reverse());
            else
                negativeWalls.push(polynode.Contour().reverse());
            polynode = polynode.GetNext();
        }

        clipper.AddPaths(positiveWalls, ADD, true);
        clipper.AddPath(newShape.polygon, SUBTRACT, true);
        clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        positiveWalls = [];
        polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                negativeWalls.push(polynode.Contour());
            else
                positiveWalls.push(polynode.Contour());
            polynode = polynode.GetNext();
        }
    }
}

function buildLevel(levelData)
{
    let wallInput = [
        {operation: ADD, polygon: [{"X":0, "Y":0}, {"X":200, "Y":0}, {"X":200, "Y":300}, {"X":0, "Y":300}]},
        {operation: ADD, polygon: [{"X":0, "Y":0}, {"X":500, "Y":0}, {"X":500, "Y":100}, {"X":0, "Y":100}]},
        {operation: ADD, polygon: [{"X":0, "Y":200}, {"X":500, "Y":200}, {"X":500, "Y":300}, {"X":0, "Y":300}]},
        {operation: ADD, polygon: [{"X":300, "Y":0}, {"X":500, "Y":0}, {"X":500, "Y":300}, {"X":300, "Y":300}]},
        {operation: SUB, polygon: [{"X":50, "Y":50}, {"X":450, "Y":50}, {"X":450, "Y":150}, {"X":50, "Y":150}]},
    ];

    // Reverse the array to use the pop() function starting from the front
    wallInput.reverse();

    // Apply every shape to the level area one by one
    while (wallInput.length != 0)
    {
        modifyLevelShape(wallInput.pop());
    }

    // Clean up the polygons
    clipper.AddPaths(positiveWalls, ADD, true);
    clipper.AddPaths(negativeWalls, SUBTRACT, true);
    clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    clipper.Clear();

    positiveWalls = [];
    negativeWalls = [];
    polynode = levelPolytree.GetFirst();
    while (polynode)
    {
        if (polynode.IsHole())
            negativeWalls.push(polynode.Contour());
        else
            positiveWalls.push(polynode.Contour());
        polynode = polynode.GetNext();
    }

    // Build all segments
    for (var polygon of positiveWalls)
    {
        for (var point = 0; point < polygon.length; point++)
        {
            createWallSegment(createVector(polygon[point].X, polygon[point].Y), createVector(polygon[(point + 1) % polygon.length].X, polygon[(point + 1) % polygon.length].Y));
        }
    }
    for (var polygon of negativeWalls)
    {
        for (var point = 0; point < polygon.length; point++)
        {
            createWallSegment(createVector(polygon[point].X, polygon[point].Y), createVector(polygon[(point + 1) % polygon.length].X, polygon[(point + 1) % polygon.length].Y));
        }
    }

    // Position camera to center bounding rectangle
    camera.x = levelData.width / 2;
    camera.y = levelData.height / 2;
    camera.zoom = Math.min(((window.innerWidth - levelMargin) / levelData.width), ((window.innerHeight - levelMargin) / levelData.height))

    // Create golf ball at "ballPosition"
    ball = Ball(levelData.ballPosition.x, levelData.ballPosition.y);

    // Create hole at "holePosition"
    hole = Hole(levelData.holePosition.x, levelData.holePosition.y);

    // For now I'm storing the level data as an array.
    // In the future it should be its own object.
    return [createVector(levelData.width, levelData.height)];
}

function drawPolygon(path, pathColor)
{
    fill(pathColor);
    beginShape();
    for (var point = 0; point < path.length; point++)
    {
        let pointVector = createVector(path[point].X, path[point].Y);
        pointVector = levelToScreen(pointVector);
        vertex(pointVector.x, pointVector.y);
    }
    endShape(CLOSE);
}

// Draws the stage
function drawStage()
{
    stroke("#000000");
    for (var wall = 0; wall < positiveWalls.length; wall++)
    {
        drawPolygon(positiveWalls[wall], floorColor);
    }
    for (var wall = 0; wall < negativeWalls.length; wall++)
    {
        drawPolygon(negativeWalls[wall], backgroundColor);
    }
    stroke("#000000");
    // fill("#000000"); // Black outline around the stage
    // rect(levelToScreen(createVector(-5, -5)).x, levelToScreen(createVector(-5, -5)).y, (level[0].x + 10) * camera.zoom, (level[0].y + 10) * camera.zoom);
    //
    // fill("#408040"); // Green floor
    // rect(levelToScreen(createVector(5, 5)).x, levelToScreen(createVector(5, 5)).y, (level[0].x - 10) * camera.zoom, (level[0].y - 10) * camera.zoom);

}

function Ball(x, y)
{
    let newBall = new Sprite(x, y);
    newBall.diameter = 20;
    newBall.color = "#ffffff";
    newBall.layer = 2;
    newBall.drag = friction;
    return newBall;
}

function Hole(x, y)
{
    let newHole = new Sprite(x, y);
    newHole.diameter = 40;
    newHole.collider = 'kinematic';
    newHole.layer = 1;
    newHole.color = 'grey';
    newHole.stroke = 'black';
    return newHole;
}
