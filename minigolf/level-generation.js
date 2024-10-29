const ADD = 0;
const SUBTRACT = 1;
const SUB = 1;

var showTopography = 0;

var ballStart, lastHit;

var floorColor = "#408040";
var minFloorColor = "#264c26";
var maxFloorColor = "#72e572";
var backgroundColor = "#f2ece3";
var wallColor = "#684917";

// Any terrain at these heights will be treated as their respective obstacles.
// Values are arbitrary.
const SAND_HEIGHT = 01134;
const WATER_HEIGHT = 843;

// "level.load(levelNumber)" loads a level.
// "level.nextLevel()" loads a level.
// "level.clear()" deletes the current level.
// "bounds" returns the edges of the level. (bounds.top, bounds.bottom, bounds.left, bounds.right)

class Level
{
    constructor(canvas)
    {
        // Constants
        this.levelMargin = 50; // Number of pixels between the level's edge and the edge of the window
        this.wallThickness = 7; // Width of the outer walls

        // Clipper utilities
        this.clipper = new ClipperLib.Clipper();
        this.levelPolytree = new ClipperLib.PolyTree(); // Tree used for clipping polygons
        this.polynode = null;

        this.canvas = canvas;
        this.ctx = canvas.getContext("webgl");
        this.vertexShader = createGlShader(this.ctx, vertexShaderSource, this.ctx.VERTEX_SHADER);
        this.fragmentShader = createGlShader(this.ctx, fragmentShaderSource, this.ctx.FRAGMENT_SHADER);

        this.shaderProgram = this.ctx.createProgram();
        this.ctx.attachShader(this.shaderProgram, this.vertexShader);
        this.ctx.attachShader(this.shaderProgram, this.fragmentShader);
        this.ctx.linkProgram(this.shaderProgram);
        this.ctx.useProgram(this.shaderProgram);

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

    //
    parseLevelHeight(operation, magnitude, shapeType, shapeArgs)
    {
        let shapeName, shapeData, grad;
        switch (shapeType.toLowerCase()) {
            case "hill":
                shapeName = "oval";
                shapeData = {
                    x: shapeArgs[0],
                    y: shapeArgs[1],
                    w: shapeArgs[2],
                    h: shapeArgs[3],
                };
                grad = "radial";
                break;
            case "oval":
                shapeName = "oval";
                shapeData = {
                    x: shapeArgs[0],
                    y: shapeArgs[1],
                    w: shapeArgs[2],
                    h: shapeArgs[3],
                };
                grad = "flat";
                break;
            case "ramp":
                shapeName = "line";
                shapeData = {
                    x1: shapeArgs[0],
                    y1: shapeArgs[1],
                    w: shapeArgs[2],
                    h: shapeArgs[3],
                };
                grad = "flat";
                break;
        }

        return {
            action: (operation == 0) ? "set" : "add",
            height: magnitude,
            shape: shapeName,
            data: shapeData,
            gradient: {
                type: grad,
            }
        };
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

    makeRect(x, y, w, h)
    {
        return [
            {"X": x, "Y": y},
            {"X": x + w, "Y": y},
            {"X": x + w, "Y": y + h},
            {"X": x, "Y": y + h},
        ];
    }

    makeOval(x, y, w, h = 0, arcLength = 359)
    {
        let polygon = [];
        const pointCount = 32;
        let circleScale = createVector(w, h);
        let circlePoint = createVector(0, 1);
        for (var i = 0; i <= arcLength / 360 * arcLength; i++)
        {
            circlePoint.rotate(360 / pointCount);
            polygon.push( { "X": x + circlePoint.x * circleScale.x, "Y": y + circlePoint.y * circleScale.y } );
        }
        if (arcLength != 360)
            polygon.push( { "X": x, "Y": y } );
        return polygon;
    }

    makePolygon(points)
    {
        let polygon = [];
        for (var i = 0; i < points.length; i += 2)
        {
            polygon.push( { "X": Number(points[i]), "Y": Number(points[i + 1]) } );
        }
        return polygon;
    }

    makeShape(shapeName, args)
    {
        switch (shapeName.toLowerCase())
        {
            case "rect":
            case "rectangle":
                return this.makeRect(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
                break;

            case "circle":
            case "circ":
            case "oval":
                return this.makeOval(Number(args[0]), Number(args[1]), Number(args[2]), args.length < 4 ? Number(args[2]) : Number(args[3]), args.length < 5 ? 359 : args[4]);
                break;

            case "poly":
            case "polygon":
                return this.makePolygon(args);
                break;

            default:
                break;
        }
    }

    parseAreaString(areaString, heightData = [])
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

            let subAreaPolygons = this.parseAreaString( areaString.slice(blockEnter + 1, blockEnter + blockLength), heightData );

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

        while (areaString.includes("  "))
            areaString = areaString.replaceAll("  ", " ");
        let statements = areaString.replaceAll(",", "").replaceAll("(", "").replaceAll(")", "").replaceAll(":", "").split(";");
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
                {
                    if (statement[0].toLowerCase() == "height" && statement.length > 4)
                    {
                        let heightOperation = statement[1] == "=" ? 0 : 1;
                        heightData.push( this.parseLevelHeight(heightOperation, statement[2], statement[3], statement.slice(4)) );
                    }
                    continue;
                }

                shape.polygon = this.makeShape(statement[1], statement.slice(2))

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
        this.heightModifiers = [];
    }

    shapeHasPoint(shape, pointX, pointY)
    {
        switch (shape.shape) {
            case "rect":
                return (
                    pointX > point.data.x
                    && pointX < point.data.x + point.data.w
                    && pointY > point.data.y
                    && pointY < point.data.y + point.data.h
                ) ? 1 : 0;
                break;

            case "oval":
                let weight = Math.max(0.0, 1 - createVector((pointX - shape.data.x) / shape.data.w, (pointY - shape.data.y) / shape.data.h).mag());
                if (shape.gradient.type == "flat")
                    return Math.ceil(weight);
                else if (shape.gradient.type == "radial")
                    return weight;
                break;

            default:
                return false;
        }
    }

    getHeight(x, y)
    {
        let height = 0;
        for (var shape of this.heightModifiers)
        {
            let shapeWeight = this.shapeHasPoint(shape, x, y);
            if (shapeWeight != 0)
            {
                if (shape.action == "add")
                    height += shape.height * shapeWeight;
                else
                    height = shape.height * shapeWeight;
            }
        }
        return height;
    }

    getNormal(x, y)
    {
        return (   createVector(x + 0.5, y, this.getHeight(x + 0.5, y)).sub(createVector(x - 0.5, y, this.getHeight(x - 0.5, y))).normalize()   ).cross(   createVector(x, y + 0.5, this.getHeight(x, y + 0.5)).sub(createVector(x, y - 0.5, this.getHeight(x, y - 0.5))).normalize()   );
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
            case 'Water':
                return Water(objectData.position[0], objectData.position[1]);
            default:
                console.warn(`Unknown object type: ${objectData.type}`);
                return null;
        }
    }

    loadLevelFromDict(levelDict)
    {
        // Delete any existing level
        this.clear();

        // Get walls from area string
        let areaPolygons = this.parseAreaString(levelDict.area, this.heightModifiers);
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

        // Get level bounding rectangle
        this.bounds = ClipperLib.Clipper.GetBounds(this.positiveWalls);
        let levelWidth = this.bounds.right - this.bounds.left;
        let levelHeight = this.bounds.bottom - this.bounds.top;

        // Position camera to center bounding rectangle
        camera.x = (this.bounds.right + this.bounds.left) / 2;
        camera.y = (this.bounds.bottom + this.bounds.top) / 2;
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


        this.maxHeight = 3;
        this.minHeight = -3;

        // Draw shader
        const maxModifiers = 10;
        let actions = new Int8Array(maxModifiers);
        let heights = new Float32Array(maxModifiers);
        let shapes = new Int8Array(maxModifiers);
        let datas = new Float32Array(maxModifiers * 4);
        let datas2 = new Float32Array(maxModifiers * 4);
        let gradients = new Int8Array(maxModifiers);
        for (var i = 0; i < this.heightModifiers.length; i++)
        {
            let modifier = this.heightModifiers[i];
            actions[i] = modifier.action == "set" ? 0 : 1;
            heights[i] = modifier.height;
            gradients[i] = (["flat", "radial"]).indexOf(modifier.gradient.type);
            switch (modifier.shape) {
                case "oval":
                    shapes[i] = 0;
                    datas[i * 4 + 0] = modifier.data.x;
                    datas[i * 4 + 1] = modifier.data.y;
                    datas[i * 4 + 2] = modifier.data.w;
                    datas[i * 4 + 3] = modifier.data.h;

                    let pointHeight = this.getHeight(modifier.data.x, modifier.data.y);
                    if (pointHeight != SAND_HEIGHT && pointHeight != WATER_HEIGHT)
                    {
                        // this.maxHeight = Math.max(this.maxHeight, pointHeight);
                        // this.minHeight = Math.min(this.minHeight, pointHeight);
                        // alert(pointHeight)
                    }
                    break;
                case "line":
                    shapes[i] = 1;
                    datas[i * 4 + 0] = modifier.data.x1;
                    datas[i * 4 + 1] = modifier.data.y1;
                    datas[i * 4 + 2] = modifier.data.x2;
                    datas[i * 4 + 3] = modifier.data.y2;

                    datas2[i * 4 + 0] = modifier.data.w;
                    break;
            }
        }
        actions[this.heightModifiers.length] = -1;

        this.ctx.uniform1iv(this.ctx.getUniformLocation(this.shaderProgram, "action"), actions);
        this.ctx.uniform1fv(this.ctx.getUniformLocation(this.shaderProgram, "height"), heights);
        this.ctx.uniform1iv(this.ctx.getUniformLocation(this.shaderProgram, "shape"), shapes);
        this.ctx.uniform4fv(this.ctx.getUniformLocation(this.shaderProgram, "data"), datas);
        this.ctx.uniform4fv(this.ctx.getUniformLocation(this.shaderProgram, "data2"), datas2);
        this.ctx.uniform1iv(this.ctx.getUniformLocation(this.shaderProgram, "gradient"), gradients);
        this.ctx.uniform1f(this.ctx.getUniformLocation(this.shaderProgram, "minHeight"), this.minHeight);
        this.ctx.uniform1f(this.ctx.getUniformLocation(this.shaderProgram, "maxHeight"), this.maxHeight);
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
                    case 'Water':
                        objectData.position = [Number(parts[2]), Number(parts[3])];
                        break;
                    case 'Volcano':
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
        // Define polygon vertices
        let vertices = new Float32Array(path.length * 2);
        for (var vert in path) {
            let pointVector = levelToScreen(createVector(path[vert].X, path[vert].Y)).div(createVector(this.canvas.width / 4, this.canvas.height / 4)).div(2).sub(1, 1).mult(1, -1);
            vertices[vert * 2] = pointVector.x;
            vertices[vert * 2 + 1] = pointVector.y;
        }

        let triangleIndices = earcut(vertices);

        for (var i = 0; i < triangleIndices.length / 3; i++) {

            let tri = new Float32Array([
                vertices[triangleIndices[i * 3] * 2], vertices[triangleIndices[i * 3] * 2 + 1],  // Vertex 1 (X, Y)
                vertices[triangleIndices[i * 3 + 1] * 2], vertices[triangleIndices[i * 3 + 1] * 2 + 1],  // Vertex 1 (X, Y)
                vertices[triangleIndices[i * 3 + 2] * 2], vertices[triangleIndices[i * 3 + 2] * 2 + 1],  // Vertex 2 (X, Y)
            ]);

            // Create a buffer and load vertices
            const vertexBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vertexBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, tri, this.ctx.STATIC_DRAW);

            const coord = this.ctx.getAttribLocation(this.shaderProgram, "coordinates");
            this.ctx.vertexAttribPointer(coord, 2, this.ctx.FLOAT, false, 0, 0);
            this.ctx.enableVertexAttribArray(coord);

            // Draw the polygon
            this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3);
        }
    }

    drawHeight(modifier)
    {
        return;
        let drawColor;
        if (modifier.height > 0)
            drawColor = maxFloorColor;
        else
            drawColor = minFloorColor;

        switch (modifier.shape)
        {
            case "oval":
                const ringCount = 24;
                let opacity = Math.floor(255 / ringCount).toString(16);
                if (opacity.length == 1)
                    opacity = "0" + opacity;
                fill(drawColor + opacity);
                stroke("#00000000");
                for (var i = 0; i < ringCount; i++)
                {
                    let center = levelToScreen(createVector(modifier.data.x, modifier.data.y));
                    ellipse(center.x, center.y, modifier.data.w / ringCount * i * camera.zoom * 2, modifier.data.h / ringCount * i * camera.zoom * 2);
                }
                break;
            default:

        }
    }

    lerpColor(a, b, amount)
    {
        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    // Draws the stage
    drawStage()
    {
        this.ctx.clearColor(1.0, 1.0, 1.0, 1.0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.uniform4f(this.ctx.getUniformLocation(this.shaderProgram, "bounds"), this.bounds.left, this.bounds.top, this.bounds.right - this.bounds.left, this.bounds.bottom - this.bounds.top);
        this.ctx.uniform2f(this.ctx.getUniformLocation(this.shaderProgram, "screenSize"), this.canvas.width, this.canvas.height);

        let date = new Date();
        this.ctx.uniform1i(this.ctx.getUniformLocation(this.shaderProgram, "time"), date.getTime() * 5.0);

        this.ctx.uniform1i(this.ctx.getUniformLocation(this.shaderProgram, "showTopography"), showTopography);

        let baseScale = (0 - this.minHeight) / (this.maxHeight - this.minHeight)
        let baseFloorColor = this.lerpColor(minFloorColor, maxFloorColor, baseScale);//"#" + this.lerpHexColor(maxFloorColor.slice(1, 2), minFloorColor.slice(1, 2), baseScale) + this.lerpHexColor(maxFloorColor.slice(3, 2), minFloorColor.slice(3, 2), baseScale) + this.lerpHexColor(maxFloorColor.slice(5, 2), minFloorColor.slice(5, 2), baseScale);

        for (var wall = 0; wall < this.positiveWalls.length; wall++)
        {
            this.drawPolygon(this.positiveWalls[wall], floorColor);
        }
        for (var hM = 0; hM < this.heightModifiers.length; hM++)
        {
            this.drawHeight(this.heightModifiers[hM]);
        }
        for (var wall = 0; wall < this.negativeWalls.length; wall++)
        {
            this.drawPolygon(this.negativeWalls[wall], backgroundColor);
        }
    }
}
