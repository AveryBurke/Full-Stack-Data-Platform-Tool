import * as twgl from "twgl.js";
import { voroniShaderSource } from "./shaders/voroniShaderSource";
import { intermediateShaderSource } from "./shaders/intermediateShaderSource";
import { transformFeedbackShaderSource } from "./shaders/transformFeedbackShaderSource";
import { stencilShaderSource } from "./shaders/stencilShaderSource";

export function createVornoiProgram(gl: WebGL2RenderingContext) {
	return twgl.createProgramInfo(gl, [voroniShaderSource.vertex, voroniShaderSource.fragment], {
		attribLocations: {
			a_arc_id: 2,
			a_position: 1,
			a_instance: 0,
		},
	});
}

export function createIntermediateProgram(gl: WebGL2RenderingContext) {
	return twgl.createProgramInfo(gl, [intermediateShaderSource.vertex, intermediateShaderSource.fragment], {
		attribLocations: {
			a_texCoord: 0,
		},
	});
}

export function createTransformFeedbackProgram(gl: WebGL2RenderingContext) {
    return twgl.createProgramInfo(gl, [transformFeedbackShaderSource.vertex, transformFeedbackShaderSource.fragment], {
        transformFeedbackVaryings: ["a_position"],
        attribLocations: {
            a_position: 0,
            a_origin: 1,
        },
    });
}

export function createStencilProgram(gl: WebGL2RenderingContext) {
    return twgl.createProgramInfo(gl, [stencilShaderSource.vertex, stencilShaderSource.fragment], {
        attribLocations: {
            a_position: 0,
        },
    });
}
