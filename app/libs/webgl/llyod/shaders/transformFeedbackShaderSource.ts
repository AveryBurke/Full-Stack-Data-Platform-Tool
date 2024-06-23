/**
 * This shader sums the columns of the intermediate texture and then divides the sum by the number of pixels summed to get the center of mass of each vornoi cell.
 * The result is then returned to the vertex buffer, though transform feedback, to be used to update the voronoi texture.
 * 
 * The following example shows how the intermediate texture is summed to get the center of mass of each voronoi cell.
 * @example
 * INTERMEDIATE TEXTURE
 *    0        1       2
 * | (1, 0, 2) | (5, 0, 2) | (0, 0, 0) |
 * | (2, 1, 2) | (2, 5, 2) | (0, 0, 0) |
 * | (2, 0, 1) | (0, 0, 0) | (6, 6, 3) |
 *     |        |         |
 *     v       v         v           0        1          2
 *  (5, 1, 5)   (7, 5, 4)    (6, 6, 3) =>  (5/5, 1/5)  (7/4, 5/4)   (6/3, 6/3)
 *  
 * The first column is summed to get the center of mass of the fvoronoi cell with integer ID 0, the second column to get the center of mass of the voronoi cell with integer ID 1, and so on.
 * 
 * For an explanation of the intermediate texture, see intermediateShaderSource.ts
 */

export const transformFeedbackShaderSource = {
	vertex: `#version 300 es
    
    layout(location = 1) in vec2 a_origin;
    out vec2 a_position;

    uniform sampler2D summed;

    void main() {
        ivec2 tex_size = textureSize(summed, 0);
        float count = 0.0;
        a_position = vec2(0.0);
        vec3 t;
        for (int y = 0; y < tex_size.y; y++){
            t = texelFetch(summed, ivec2(gl_VertexID, y), 0).xyz; 
            a_position += t.xy;
            count += t.z;
        }
        /* 
        * these coordinates are normalized betwen 0 and 1 by the previous shader. 
        * but they're being put back into a vertex buffer
        * so they need to be re-normalized to vertex coords (between -1 and 1)
        */
        if (int(count) > 0){
            a_position  = (a_position / count) * 2.0 - 1.0;
        } else {
            a_position = a_origin;
        }
    }`,
	fragment: `#version 300 es
    precision highp float;

    void main() {
    discard;
    }`,
};
