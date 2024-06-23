/**
 * This shader renders boundries to a texture.  
 * The boundries are assigned an integer ID as colors.
 * The voronoi shader samples this texture to determine if a pixel is inside the appropriate boundary.
 * Pixels aren't drawn outside the boundary.
 */
export const stencilShaderSource = {
    vertex:`#version 300 es

    in vec3 a_position; //x and y are positions and z is id
    flat out int v_ID;
    void main() {
        v_ID = int(a_position.z);
        gl_Position = vec4(a_position.x, -a_position.y, 1.0, 1.0);
    }`,
    fragment: `#version 300 es

    precision highp float;
    flat in int v_ID; 
    out ivec4 outColor;

    void main() {
        outColor = ivec4(v_ID, 0, 0, 1);   
    }`
} 