# Darien's guide to the Level Building Language

## Summary

Each statement in the code specifies an operation (add or subtract) and a shape. The interpreter performs the specified [boolean operation](https://en.wikipedia.org/wiki/Boolean_operations_on_polygons#/media/File:Boolean_operations_on_shapes-en.svg) using the given shape and the current level area to create a new level area.

Ex. The following code creates a square-shaped level with a circular hole in the center:
```
ADD rect 0, 0, 100, 100;
SUB circle 50, 50, 20;
```

## First Word - `ADD` or `SUB`

The first word of the statement determines the operation performed with the shape. `ADD` specifies a UNION operation, while `SUB` specifies a DIFFERENCE operation.

## Second word - Shape

The second word of the statement determines the shape to be used in the operation. What remains of the statement becomes the shape's parameters.

### Rectangles - `rect`, `rectangle`

```
ADD rect 20, 30, 100, 150;
```

The rectangle shape takes 4 values:
1. The x-position of the left edge
2. The y-position of the top edge
3. The rectangle's width
4. The rectangle's height

### Ovals - `circle`, `circ`, `oval`

```
ADD circle 50, 50, 20;
ADD oval 100, 50, 20, 60;
```

The oval shape takes 3-4 values:
1. The x-position of the oval's center
2. The y-position of the oval's center
3. The x-radius of the oval
4. *(Optional) The y-radius of the oval; if not specified then the oval will be a circle with the third parameter as its radius*

### Polygons - `poly`, `polygon`

```
ADD poly (0, 50), (100, 100), (0, 100);
```

The polygon shape takes any number of parameters. Each parameter is a point on the polygon. **Polygons must be oriented clockwise.**

## Blocks - `{ }`

```
{
    ADD circle 250, 75, 150;
    SUB circle 250, 75, 100;
}

ADD {
    ADD circle 250, 75, 150;
    SUB circle 250, 75, 100;
}

SUB {
    ADD circle 250, 75, 150;
    SUB circle 250, 75, 100;
}

```

Group statements with `{` and `}` to resolve them as a separate block. This allows you to apply additions and subtractions to certain shapes while ignoring others (useful when designing complex layouts in tight spaces). Once a block is resolved, the resulting shape is then added to or subtracted from the rest of the level area, depending on what operation is listed before the block. If no operation is listed, it defaults to `ADD`.

Blocks can also be nested.

## Comments

```
// Donut shape;
ADD circle 250, 75, 150;
SUB circle 250, 75, 100;
```

You can write comments by starting a statement with `//`. **You must end the comment with a semicolon or the following statement will be ignored.**

## Elevation

```
// Create a hill with radius at (100, 200), a peak at height 3, and a radius of (30, 40);
HEIGHT + 3: hill 100, 200, 30, 40;
```

## Sand and Water

```
// Sand in a rectangle shape;
HEIGHT = 01134: rect 0, 0, 50, 50;

// Water in an oval shape;
HEIGHT = 843: oval 50, 50, 20, 20;
```



