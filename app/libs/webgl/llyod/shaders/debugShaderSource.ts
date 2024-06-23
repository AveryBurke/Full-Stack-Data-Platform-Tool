export const debugShaderSource = {
	vertex: `#version 300 es

    layout(location = 0) in vec2 a_position;
    //render quad
    void main(){
        gl_Position = vec4(a_position.xy, 0.0, 1.0);
    }
    `,
	fragment: `#version 300 es
    precision highp float;

    // uniform mediump isampler2D voroni;
    // uniform vec4 u_colors[1000];
    

    out vec4 outColor;
    //add a sampler. Sample from stencil shader
    void main() {
        // ivec4 t = texelFetch(voroni, ivec2(gl_FragCoord.xy), 0);
        outColor = vec4(1, 0, 0, 1);   
    }`,
};
