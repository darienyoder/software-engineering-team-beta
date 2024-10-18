const ADD = 0;
const SUBTRACT = 1;
const SUB = 1;

var ballStart, lastHit;

var floorColor = "#408040";
var backgroundColor = "#f2ece3";
var wallColor = "#684917";

// "level.load(levelNumber)" loads a level.
// "level.nextLevel()" loads a level.
// "level.clear()" deletes the current level.
// "bounds" returns the edges of the level. (bounds.top, bounds.bottom, bounds.left, bounds.right)

class Level
{
    constructor()
    {
        // Constants
        this.levelMargin = 50; // Number of pixels between the level's edge and the edge of the window
        this.wallThickness = 7; // Width of the outer walls

        // Clipper utilities
        this.clipper = new ClipperLib.Clipper();
        this.levelPolytree = new ClipperLib.PolyTree(); // Tree used for clipping polygons
        this.polynode = null;

        // Level Data
        this.number = -1;
        this.walls = []; // Wall sprites
        this.positiveWalls = []; // Polygons that add to the level area
        this.negativeWalls = []; // Holes in the level area

    }

    createWallSegment(fromVector, toVector)
    {
        let newWall = new Sprite((fromVector.x + toVector.x) / 2.0, (fromVector.y + toVector.y) / 2.0, fromVector.dist(toVector), this.wallThickness);
        newWall.rotation = createVector(1, 0).angleBetween( toVector.sub(fromVector) );
        newWall.strokeWeight = 0.0;
        newWall.color = wallColor;
        newWall.collider = "static";
        this.walls.push(newWall);

        newWall = new Sprite(fromVector.x, fromVector.y, this.wallThickness);
        newWall.strokeWeight = 0.0;
        newWall.color = wallColor;
        newWall.collider = "static";
        this.walls.push(newWall);
    }

    // Adds or subtracts shapes from the current level area
    // newShape = {operation (ADD or SUB), polygon (list of points)}
    modifyLevelShape(newShape, posWalls, negWalls)
    {
        if (newShape.operation == ADD)
        {
            this.clipper.AddPaths(posWalls, ADD, true);
            this.clipper.AddPath(newShape.polygon, ADD, true);
            this.clipper.Execute(ClipperLib.ClipType.ctUnion, this.levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
            this.clipper.Clear();

            posWalls.length = 0;
            this.polynode = this.levelPolytree.GetFirst();
            while (this.polynode)
            {
                if (this.polynode.IsHole())
                {
                    negWalls.push(this.polynode.Contour());
                }
                else
                {
                    posWalls.push(this.polynode.Contour());
                }
                this.polynode = this.polynode.GetNext();
            }

            this.clipper.AddPaths(negWalls, ADD, true);
            this.clipper.AddPath(newShape.polygon, SUBTRACT, true);
            this.clipper.Execute(ClipperLib.ClipType.ctDifference, this.levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
            this.clipper.Clear();

            negWalls.length = 0;
            this.polynode = this.levelPolytree.GetFirst();
            while (this.polynode)
            {
                if (this.polynode.IsHole())
                    posWalls.push(this.polynode.Contour().reverse());
                else
                    negWalls.push(this.polynode.Contour().reverse());
                this.polynode = this.polynode.GetNext();
            }
        }
        else
        {
            this.clipper.AddPaths(negWalls, ADD, true);
            this.clipper.AddPath(newShape.polygon, ADD, true);
            this.clipper.Execute(ClipperLib.ClipType.ctUnion, this.levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
            this.clipper.Clear();

            negWalls.length = 0;
            this.polynode = this.levelPolytree.GetFirst();
            while (this.polynode)
            {
                if (this.polynode.IsHole())
                    posWalls.push(this.polynode.Contour().reverse());
                else
                    negWalls.push(this.polynode.Contour().reverse());
                this.polynode = this.polynode.GetNext();
            }

            this.clipper.AddPaths(posWalls, ADD, true);
            this.clipper.AddPath(newShape.polygon, SUBTRACT, true);
            this.clipper.Execute(ClipperLib.ClipType.ctDifference, this.levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
            this.clipper.Clear();

            posWalls.length = 0;
            this.polynode = this.levelPolytree.GetFirst();
            while (this.polynode)
            {
                if (this.polynode.IsHole())
                    negWalls.push(this.polynode.Contour());
                else
                    posWalls.push(this.polynode.Contour());
                this.polynode = this.polynode.GetNext();
            }
        }
    }

    // Eliminates any overlapping shapes in the area
    cleanPolygons(area)
    {
        let posWalls = area[0];
        let negWalls = area[1];
        this.clipper.AddPaths(posWalls, ADD, true);
        this.clipper.AddPaths(negWalls, SUBTRACT, true);
        this.clipper.Execute(ClipperLib.ClipType.ctDifference, this.levelPolytree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        this.clipper.Clear();

        posWalls = [];
        negWalls = [];
        this.polynode = this.levelPolytree.GetFirst();
        while (this.polynode)
        {
            if (this.polynode.IsHole())
                negWalls.push(this.polynode.Contour());
            else
                posWalls.push(this.polynode.Contour());
            this.polynode = this.polynode.GetNext();
        }

        return [posWalls, negWalls];
    }

    parseAreaString(areaString)
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

            let subAreaPolygons = this.parseAreaString( areaString.slice(blockEnter + 1, blockEnter + blockLength) );

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
                this.modifyLevelShape(shape, posWalls, negWalls);
            }
        }

        return this.cleanPolygons([posWalls, negWalls]);
    }

    clear()
    {
        this.positiveWalls = [];
        this.negativeWalls = [];
        for (var wall of this.walls)
        {
            wall.remove();
        }
        while (gameObjects.length != 0)
        {
            gameObjects.pop().delete();
        }
    }

    createGameObject(objectData) {
        switch (objectData.type) {
            case 'Ball':
                return Ball(objectData.position[0], objectData.position[1]);
            case 'Hole':
                return Hole(objectData.position[0], objectData.position[1]);
            case 'Sandtrap':
                return Sandtrap(objectData.position[0], objectData.position[1], objectData.width, objectData.height);
            case 'Tubes':
                return Tubes(objectData.position[0], objectData.position[1], objectData.targetPosition[0], objectData.targetPosition[1]);
            case 'Windmill':
                return Windmill(objectData.position[0], objectData.position[1]);
            case 'Volcano':
                return Volcano(objectData.position[0],objectData.position[1]);
            default:
                console.warn(`Unknown object type: ${objectData.type}`);
                return null;
        }
    }

    loadLevelFromDict(levelDict)
    {
        // Delete any existing level
        this.clear();
        // Check for obstacles and delete them

        // Get walls from area string
        let areaPolygons = this.parseAreaString(levelDict.area);
        this.positiveWalls = areaPolygons[0];
        this.negativeWalls = areaPolygons[1];

        // Build all segments
        for (var polygon of this.positiveWalls)
        {
            for (var point = 0; point < polygon.length; point++)
            {
                this.createWallSegment(createVector(polygon[point].X, polygon[point].Y), createVector(polygon[(point + 1) % polygon.length].X, polygon[(point + 1) % polygon.length].Y));
            }
        }
        for (var polygon of this.negativeWalls)
        {
            for (var point = 0; point < polygon.length; point++)
            {
                this.createWallSegment(createVector(polygon[point].X, polygon[point].Y), createVector(polygon[(point + 1) % polygon.length].X, polygon[(point + 1) % polygon.length].Y));
            }
        }

        this.bounds = ClipperLib.Clipper.GetBounds(this.positiveWalls);
        let levelWidth = this.bounds.right - this.bounds.left;
        let levelHeight = this.bounds.bottom - this.bounds.top;


    // Position camera
    if(cameraMode == "Center")
        {
            camera.x = (this.bounds.right + this.bounds.left) / 2;
            camera.y = (this.bounds.bottom + this.bounds.top) / 2;
        } 
    else if (cameraMode == "Follow")
        {
            //camera.x = ballPosition.x;
            camera.x = ball.x;
            camera.y = ball.y;
            // camera.y = ballPosition.y;
        }
        camera.zoom = Math.min(((window.innerWidth - this.levelMargin) / levelWidth), ((window.innerHeight - this.levelMargin) / levelHeight))

        // Create golf ball at "ballPosition"
        ball = Ball(levelDict.ballPosition[0], levelDict.ballPosition[1]);
        ballStart = createVector(levelDict.ballPosition[0], levelDict.ballPosition[1]);
        lastHit = ballStart;

        gameObjects.push(ball);
        ball = ball.sprites[0];

        // Create hole at "holePosition"
        hole = Hole(levelDict.holePosition[0], levelDict.holePosition[1]);
        gameObjects.push(hole);
        hole = hole.sprites[0];
        // Create obstacles
        this.createObstacles(levelDict.obstacles);
    }

    createObstacles(obstaclesString) {
        // Parse the obstacles string and create game objects
        const obstacleStatements = obstaclesString.trim().split(';').filter(Boolean);
        for (const statement of obstacleStatements) {
            const parts = statement.trim().split(' ');

            // Example structure: "ADD Sandtrap 50 50 100 30"
            if (parts[0].toLowerCase() === 'add') {
                const objectType = parts[1];
                let objectData = { type: objectType };

                switch (objectType) {
                    case 'Sandtrap':
                        objectData.position = [Number(parts[2]), Number(parts[3])];
                        objectData.width = Number(parts[4]);
                        objectData.height = Number(parts[5]);
                        break;
                    case 'Tubes':
                        objectData.position = [Number(parts[2]), Number(parts[3])];
                        objectData.targetPosition = [Number(parts[4]), Number(parts[5])];
                        break;
                    case 'Windmill':
                        objectData.position = [Number(parts[2]), Number(parts[3])];
                        break;
                    // Add more cases for other object types as needed
                }

                const gameObject = this.createGameObject(objectData);
                if (gameObject) {
                    gameObjects.push(gameObject); // Assuming gameObjects is a global array
                }
            }
        }
    }

    load(number)
    {
        this.number = number;
        this.loadLevelFromDict(levelData[number]);
    }


    nextLevel()
    {
        if (this.number == levelData.length - 1)
        {
            this.clear();
            gameState = 'gameOver';
        }
        else
            this.load(this.number + 1);
    }

    drawPolygon(path, pathColor)
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
    drawStage()
    {
        background(backgroundColor);

        stroke("#000000");
        for (var wall = 0; wall < this.positiveWalls.length; wall++)
        {
            this.drawPolygon(this.positiveWalls[wall], floorColor);
        }
        for (var wall = 0; wall < this.negativeWalls.length; wall++)
        {
            this.drawPolygon(this.negativeWalls[wall], backgroundColor);
        }
        stroke("#000000");
    }
}
