const levelMargin = 50; // Number of pixels between the level's edge and the edge of the window
const wallThickness = 7; // Width of the outer walls

const floorColor = "#408040";
const backgroundColor = "#f2ece3";
const wallColor = "#684917";

const ADD = 0;
const SUBTRACT = 1;
const SUB = 1;

var levelPolytree = new ClipperLib.PolyTree(); // Tree used for clipping polygons

var walls = []; // Wall sprites

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
    walls.push(newWall);

    newWall = new Sprite(fromVector.x, fromVector.y, wallThickness);
    newWall.strokeWeight = 0.0;
    newWall.color = wallColor;
    newWall.collider = "static";
    walls.push(newWall);
}

// Adds or subtracts shapes from the current level area
// newShape = {operation (ADD or SUB), polygon (list of points)}
function modifyLevelShape(newShape, posWalls, negWalls)
{
    if (newShape.operation == ADD)
    {
        clipper.AddPaths(posWalls, ADD, true);
        clipper.AddPath(newShape.polygon, ADD, true);
        clipper.Execute(ClipperLib.ClipType.ctUnion, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        posWalls.length = 0;
        let polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
            {
                negWalls.push(polynode.Contour());
            }
            else
            {
                posWalls.push(polynode.Contour());
            }
            polynode = polynode.GetNext();
        }

        clipper.AddPaths(negWalls, ADD, true);
        clipper.AddPath(newShape.polygon, SUBTRACT, true);
        clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        negWalls.length = 0;
        polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                posWalls.push(polynode.Contour().reverse());
            else
                negWalls.push(polynode.Contour().reverse());
            polynode = polynode.GetNext();
        }
    }
    else
    {
        clipper.AddPaths(negWalls, ADD, true);
        clipper.AddPath(newShape.polygon, ADD, true);
        clipper.Execute(ClipperLib.ClipType.ctUnion, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        negWalls.length = 0;
        let polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                posWalls.push(polynode.Contour().reverse());
            else
                negWalls.push(polynode.Contour().reverse());
            polynode = polynode.GetNext();
        }

        clipper.AddPaths(posWalls, ADD, true);
        clipper.AddPath(newShape.polygon, SUBTRACT, true);
        clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        clipper.Clear();

        posWalls.length = 0;
        polynode = levelPolytree.GetFirst();
        while (polynode)
        {
            if (polynode.IsHole())
                negWalls.push(polynode.Contour());
            else
                posWalls.push(polynode.Contour());
            polynode = polynode.GetNext();
        }
    }
}

function parseAreaString(areaString)
{
    let posWalls = [];
    let negWalls = [];

    while (areaString.includes("{"))
    {
        let blockEnter = areaString.indexOf("{");
        let blockLength = 0;
        let blockDepth = 1;
        let blockOperation = ADD;

        for (var i = blockEnter - 1; i >= 0; i--)
        {
            if (areaString[i] != " ")
            {
                if (areaString[i].toLowerCase() == "b")
                    blockOperation = SUB;
                else
                    blockOperation = ADD;
                break;
            }
        }

        while (blockDepth > 0)
        {
            blockLength++;
            if (areaString[blockEnter + blockLength] == "{")
                blockDepth++;
            else if (areaString[blockEnter + blockLength] == "}")
                blockDepth--;
        }

        let subAreaPolygons = parseAreaString( areaString.slice(blockEnter + 1, blockEnter + blockLength) );

        let subAreaReplacement = ";";
        for (var polygon of subAreaPolygons[0])
        {
            subAreaReplacement += (blockOperation == SUB) ? "SUB poly" : "ADD poly";
            for (var point of polygon)
            {
                subAreaReplacement += " " + String(point.X) + " " + String(point.Y);
            }
            subAreaReplacement += ";";
        }
        for (var polygon of subAreaPolygons[1])
        {
            subAreaReplacement += (blockOperation == SUB) ? "ADD poly" : "SUB poly";
            for (var point of polygon)
            {
                subAreaReplacement += " " + String(point.X) + " " + String(point.Y);
            }
            subAreaReplacement += ";";
        }

        areaString = areaString.replace(areaString.slice(blockEnter, blockEnter + blockLength + 1), subAreaReplacement);
    }

    let statements = areaString.replaceAll(",", "").replaceAll("(", "").replaceAll(")", "").split(";");
    for (var statement of statements)
    {
        statement = statement.trim().split(" ");
        if (statement.length > 2)
        {
            let shape = {operation: 0, polygon: []};
            if (statement[0].toLowerCase() == "add")
                shape.operation = ADD;
            else if (statement[0].toLowerCase() == "sub")
                shape.operation = SUBTRACT;
            else
                continue;

            switch (statement[1].toLowerCase())
            {
                case "rect":
                case "rectangle":
                    shape.polygon = [
                        {"X": Number(statement[2]), "Y": Number(statement[3])},
                        {"X": Number(statement[2]) + Number(statement[4]), "Y": Number(statement[3])},
                        {"X": Number(statement[2]) + Number(statement[4]), "Y": Number(statement[3]) + Number(statement[5])},
                        {"X": Number(statement[2]), "Y": Number(statement[3]) + Number(statement[5])},
                    ];
                    break;

                case "circle":
                case "circ":
                case "oval":
                    const pointCount = 32
                    let circleScale = createVector(Number(statement[4]), statement.length < 6 ? Number(statement[4]) : Number(statement[5]));
                    let arcLength = statement.length < 7 ? 359 : statement[6];
                    let circlePoint = createVector(0, 1);
                    for (var i = 0; i <= arcLength / 360 * arcLength; i++)
                    {
                        circlePoint.rotate(360 / pointCount);
                        shape.polygon.push( { "X": Number(statement[2]) + circlePoint.x * circleScale.x, "Y": Number(statement[3]) + circlePoint.y * circleScale.y } );
                    }
                    if (arcLength != 360)
                        shape.polygon.push( { "X": Number(statement[2]), "Y": Number(statement[3]) } );
                    break;

                case "poly":
                case "polygon":
                    for (var i = 2; i < statement.length; i += 2)
                    {
                        shape.polygon.push( { "X": Number(statement[i]), "Y": Number(statement[i + 1]) } );
                    }
                    break;

                default:
                    break;
            }
            modifyLevelShape(shape, posWalls, negWalls);
        }
    }

    // Clean up the polygons
    clipper.AddPaths(posWalls, ADD, true);
    clipper.AddPaths(negWalls, SUBTRACT, true);
    clipper.Execute(ClipperLib.ClipType.ctDifference, levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    clipper.Clear();

    posWalls = [];
    negWalls = [];
    polynode = levelPolytree.GetFirst();
    while (polynode)
    {
        if (polynode.IsHole())
            negWalls.push(polynode.Contour());
        else
            posWalls.push(polynode.Contour());
        polynode = polynode.GetNext();
    }

    return [posWalls, negWalls];
}

function buildLevel(levelData)
{

    let areaPolygons = parseAreaString(levelData.area);
    positiveWalls = areaPolygons[0];
    negativeWalls = areaPolygons[1];

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

    let levelBounds = ClipperLib.Clipper.GetBounds(positiveWalls);
    let levelWidth = levelBounds.right - levelBounds.left;
    let levelHeight = levelBounds.bottom - levelBounds.top;

    // Position camera to center bounding rectangle
    camera.x = (levelBounds.right + levelBounds.left) / 2;
    camera.y = (levelBounds.bottom + levelBounds.top) / 2;
    camera.zoom = Math.min(((window.innerWidth - levelMargin) / levelWidth), ((window.innerHeight - levelMargin) / levelHeight))

    // Create golf ball at "ballPosition"
    ball = Ball(levelData.ballPosition[0], levelData.ballPosition[1]);

    // Create hole at "holePosition"
    hole = Hole(levelData.holePosition[0], levelData.holePosition[1]);

    // For now I'm storing the level data as an array.
    // In the future it should be its own object.
    return [createVector(levelWidth, levelHeight)];
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
