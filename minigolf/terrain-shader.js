const vertexShaderSource = `
attribute vec2 coordinates;
void main(void) {
    gl_Position = vec4(coordinates, 0.0, 1.0);
}
`;

const fragmentShaderSource = `

#ifdef GL_ES
precision mediump float;
#endif

uniform int time;

uniform float minHeight;
uniform float maxHeight;

const vec3 minHeightColor = vec3(.149, .298, .149);
const vec3 maxHeightColor = vec3(.447, .898, .447);

const float SAND_HEIGHT = 01134.0;
const float WATER_HEIGHT = 843.0;

uniform vec2 screenSize;
uniform vec4 bounds;

const int maxModifiers = 10;
uniform int action[maxModifiers];
uniform float height[maxModifiers];
uniform int shape[maxModifiers];
uniform vec4 data[maxModifiers];
uniform vec4 data2[maxModifiers];
uniform int gradient[maxModifiers];

uniform int showTopography;

vec2 reverseYCoordinates( vec2 screenCoords )
{
	return vec2(screenCoords.x, screenSize.y - screenCoords.y);
}

vec2 screenToLevel( vec2 screenCoords )
{
	return bounds.xy + reverseYCoordinates(screenCoords.xy) / screenSize.xy * bounds.zw;
}

float distanceSquaredToLineSegment(float lx1, float ly1, float lx2, float ly2, float px, float py) {
    float ldx = lx2 - lx1;
    float ldy = ly2 - ly1;
    float lineLengthSquared = ldx*ldx + ldy*ldy;

    float t;
   if (lineLengthSquared == 0.0) {
      t = 0.0;
   }
   else {
     t = ((px - lx1) * ldx + (py - ly1) * ldy) / lineLengthSquared;

      if (t < 0.0)
         t = 0.0;
      else if (t > 1.0)
         t = 1.0;
   }

   float lx = lx1 + t * ldx,
       ly = ly1 + t * ldy,
       dx = px - lx,
       dy = py - ly;
   return dx*dx + dy*dy;
}

float distanceToLineSegment(vec2 lineStart, vec2 lineEnd, vec2 point)
{
   return sqrt(distanceSquaredToLineSegment(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y, point.x, point.y));
}

float shapeHasPoint(int shapeType, vec4 shapeData, vec4 shapeData2, int grad, vec2 point)
{
    if (shapeType == 0) // Oval
    {
        if (point.x < shapeData.x - shapeData.z || point.x > shapeData.x + shapeData.z || point.y < shapeData.y - shapeData.w || point.y > shapeData.y + shapeData.w)
            return 0.0;
        float weight = max(0.0, 1.0 - length(vec2((point.x - shapeData.x) / shapeData.z, (point.y - shapeData.y) / shapeData.w)));
        if (grad == 0)
            return ceil(weight);
        else
            return weight;
    }
    if (shapeType == 1) // Line
    {
        float weight = (distanceToLineSegment(shapeData.xy, shapeData.zw, point.xy) < shapeData2.x) ? 1.0 : 0.0;
        if (grad == 0)
            return ceil(weight);
        else
            return weight;
    }
    return 0.0;
}

float getHeight(vec2 coords)
{
    float pointHeight = 0.0;

    for (int i = 0; i < maxModifiers; ++i)
    {
        if (action[i] == -1)
            break;
        float weight = shapeHasPoint(shape[i], data[i], data2[i], gradient[i], coords);
        if (weight != 0.0)
        {
            if (action[i] == 1)
                pointHeight += height[i] * weight;
            else
                pointHeight = height[i] * weight;
        }
    }

    return pointHeight;
}

bool isTopographyLine(float pointHeight)
{
    return (showTopography == 1) && pointHeight != 0.0 && (mod(pointHeight + float(time) * 0.00001, 0.2) > 0.02 && mod(pointHeight + float(time) * 0.00001, 0.2) < 0.04);
}

void main( void )
{
    vec2 coords = screenToLevel( gl_FragCoord.xy );

    float pointHeight = getHeight(coords);
	vec3 color = mix( minHeightColor, maxHeightColor, (pointHeight - minHeight) / (maxHeight - minHeight) );
    if (pointHeight == SAND_HEIGHT)
        color = vec3(0.824,0.706,0.549);
    else if (pointHeight == WATER_HEIGHT)
        color = vec3(0, 0, 1);

    if (isTopographyLine(pointHeight))
        color = vec3(0.2 + 0.8 * (pointHeight - minHeight) / (maxHeight - minHeight));

	gl_FragColor.rgb = color;
}

`;

function createGlShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
