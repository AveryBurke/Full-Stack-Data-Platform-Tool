/**
 * The fragment shader scans the vornoi texture in the x direction and sums the coordinates of the pixels that match the current y coordinate.
 * The sum is recorded in the red and green channels of the output color, and the number of pixels summed is recorded in the blue channel.
 * The resul can be thought of as a grid whose columns are the integer IDs of the voronoi cells and whose rows
 * are the sum of all the coordinates of the pixels in the voronoi at that y coordinate.
 * Consider the following example with three voronoi cells and a texture size of 4x4:
 * @example
 *  VORONOI TEXTURE       INTERMEDIATE TEXTURE
 *                       0        1       2
 * | 0 | 0 | 1 | 1 |  ->  | (1, 0, 2) | (5, 0, 2) | (0, 0, 0) |
 * | 0 | 0 | 1 | 1 |  ->  | (2, 1, 2) | (2, 5, 2) | (0, 0, 0) |
 * | 0 | 2 | 2 | 2 |  ->  | (2, 0, 1) | (0, 0, 0) | (6, 6, 3) |
 * | 2 | 2 | 2 | 2 |  ->  | (0, 0, 0) | (0, 0, 0) | (12, 6, 4) |
 * @comment
 * The color at coordiante (1, 0) was calculated by all adding the coordinates of all the pixels in the voronoi cell with ID 1 at y = 0, in the vornoi texture.
 * (2, 0) + (3, 0) = (2 + 3, 0 + 0, 2) = (5, 0, 2), where the 2 at the end is the number of pixels summed..
 * These columns will be summed by the next shader to get the center of mass of each voronoi cell, which will be used to update the voronoi texture.
 * See transformFeedbackShaderSource.ts for more information.
 */
export const intermediateShaderSource = {
	vertex: `#version 300 es

    layout(location = 0) in vec2 a_texCoord;

    void main() {
        gl_Position = vec4(a_texCoord, 1, 1);
    }`,

	fragment: `#version 300 es
    precision highp float;

    uniform mediump isampler2D voroni;

    out vec4 color;

    void main() {
        ivec2 tex_size = textureSize(voroni, 0);
        int my_index = int(gl_FragCoord.x);
        color = vec4(0.0, 0.0, 0.0, 1.0);
        ivec2 coord;
        ivec4 t;
        int id;
        for (int x = 0; x < tex_size.x; x++) {
            coord = ivec2(x, gl_FragCoord.y);
            t = texelFetch(voroni, coord, 0);
            id = t.r;
            if (id == my_index) {
                color.xy += vec2(coord) + 0.5;
                color.z += 1.0;
            }
        }
        color.xy /= float(tex_size);
    }`,
};
