import * as twgl from "twgl.js";
import { stencilShaderSource } from "./shaders/stencilShaderSource";
import createCone from "./createCone";
import { voroniShaderSource } from "./shaders/voroniShaderSource";
import { intermediateShaderSource } from "./shaders/intermediateShaderSource";
import { transformFeedbackShaderSource } from "./shaders/transformFeedbackShaderSource";
export class VornoiMesh {
	// transformFeedback: WebGLTransformFeedback;
	// textureWidth: number;
	// textureHeight: number;
	// cycles: number;
	stencil: number[] = [];
	offsets: number[] = [];
	offsetArcIds: number[] = [];
	vertex = createCone(36);
	chunks = 0;
	// stencilFrameBufferInfo: twgl.FramebufferInfo;
	// gl: WebGL2RenderingContext;
	quad = new Float32Array([
		// First triangle:
		1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
		// Second triangle:
		-1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
	]);
	// stencilProgram: twgl.ProgramInfo;
	// vornoiProgram: twgl.ProgramInfo;
	// intermediateProgram: twgl.ProgramInfo;
	// stencilBufferArrays: twgl.Arrays;
	// vornoiBufferArrays: twgl.Arrays;
	// vornoiBufferInfo: twgl.BufferInfo;
	// vornoiFrameBufferInfo: twgl.FramebufferInfo;
	// stencilBufferInfo: twgl.BufferInfo;
	// intermediateFrameBufferInfo: twgl.FramebufferInfo;
	intermediateBufferArrays = {
		a_texCoord: {
			numComponents: 2,
			data: this.quad,
		},
	};
	// intermediateBufferInfo: twgl.BufferInfo;
	// transformFeedbackProgram: twgl.ProgramInfo;
	// feedbackVoaInfo: twgl.VertexArrayInfo;
	keepOpen = false;
	buffersReady = true;
	// callBack: ({payload, keepOpen}:{payload:Float32Array, keepOpen:boolean}) => void;
}
