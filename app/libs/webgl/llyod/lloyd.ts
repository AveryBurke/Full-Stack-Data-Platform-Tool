import * as twgl from "twgl.js";
import createCone from "./createCone";
import { createVornoiProgram, createIntermediateProgram, createTransformFeedbackProgram, createStencilProgram } from "./programs";
import { arc } from "d3-shape";

/**
 *
 */
export class Lloyd {
	transformFeedback: WebGLTransformFeedback;
	textureWidth: number;
	textureHeight: number;
	cycles: number;
	stencil: number[] = [];
	offsets: number[] = [];
	offsetArcIds: number[] = [];
	vertex = createCone(36);
	chunks = 0;
	stencilFrameBufferInfo: twgl.FramebufferInfo;
	gl: WebGL2RenderingContext;
	quad = new Float32Array([
		// First triangle:
		1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
		// Second triangle:
		-1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
	]);
	stencilProgram: twgl.ProgramInfo;
	vornoiProgram: twgl.ProgramInfo;
	intermediateProgram: twgl.ProgramInfo;
	stencilBufferArrays = {
		a_position: {
			numComponents: 3,
			data: new Float32Array(this.stencil),
			drawType: 0,
		},
	};
	vornoiBufferArrays = {
		a_position: {
			numComponents: 2,
			divisor: 1,
			data: new Float32Array([...this.offsets]),
			drawType: 0,
		},
		a_arc_id: {
			numComponents: 1,
			divisor: 1,
			data: new Int32Array([...this.offsetArcIds]),
			drawType: 0,
		},
		a_instance: {
			numComponents: 3,
			data: createCone(36),
		},
		a_origin: {
			numComponents: 2,
			data: new Float32Array([...this.offsets]),
			drawType: 0,
		},
	};
	vornoiBufferInfo: twgl.BufferInfo;
	vornoiFrameBufferInfo: twgl.FramebufferInfo;
	stencilBufferInfo: twgl.BufferInfo;
	intermediateFrameBufferInfo: twgl.FramebufferInfo;
	intermediateBufferArrays = {
		a_texCoord: {
			numComponents: 2,
			data: this.quad,
		},
	};
	intermediateBufferInfo: twgl.BufferInfo;
	transformFeedbackProgram: twgl.ProgramInfo;
	feedbackVoaInfo: twgl.VertexArrayInfo;
	keepOpen = false;
	buffersReady = true;
	callBack: ({ payload, keepOpen }: { payload: Float32Array; keepOpen: boolean }) => void;

	constructor(
		gl: WebGL2RenderingContext,
		textureWidth: number,
		textureHeight: number,
		cycles: number,
		callback: ({ payload, keepOpen }: { payload: Float32Array; keepOpen: boolean }) => void
	) {
		this.textureWidth = textureWidth;
		this.textureHeight = textureHeight;
		this.cycles = cycles;
		this.gl = gl;
		this.callBack = callback;
		this.transformFeedback = gl.createTransformFeedback()!;

		if (!gl.getExtension("EXT_color_buffer_float")) {
			console.error("voroni error: color extention does not exist");
		}
		let redExt: WEBGL_compressed_texture_etc | EXT_texture_compression_rgtc | null =
			gl.getExtension("WEBGL_compressed_texture_etc") || gl.getExtension("EXT_texture_compression_rgtc");
		if (!redExt) {
			console.error("compressed textures not supported on this machine");
		}

		this.stencilProgram = createStencilProgram(gl);
		this.stencilBufferArrays.a_position.data = new Float32Array(this.stencil);
		this.stencilBufferArrays.a_position.drawType = gl.STATIC_DRAW;
		this.stencilBufferInfo = twgl.createBufferInfoFromArrays(gl, this.stencilBufferArrays);

		this.stencilFrameBufferInfo = twgl.createFramebufferInfo(
			gl,
			[
				//we only need 1 and 0 for the stencil.
				{
					internalFormat: gl.R32I,
					format: gl.RED_INTEGER,
					type: gl.INT,
					minMag: gl.NEAREST,
				},
			],
			textureWidth,
			textureHeight
		);

		this.vornoiProgram = createVornoiProgram(gl);
		this.vornoiFrameBufferInfo = twgl.createFramebufferInfo(
			gl,
			[
				//store only integers on the red channel. these are the ids for each cell
				{
					internalFormat: gl.R32I,
					format: gl.RED_INTEGER,
					type: gl.INT,
					minMag: gl.NEAREST,
				},
				{
					attachmentPoint: gl.DEPTH_ATTACHMENT,
					internalFormat: gl.DEPTH_COMPONENT24,
					format: gl.DEPTH_COMPONENT,
				},
			],
			textureWidth,
			textureHeight
		);
		this.vornoiBufferArrays.a_position.drawType = gl.DYNAMIC_DRAW;
		this.vornoiBufferArrays.a_arc_id.drawType = gl.DYNAMIC_DRAW;
		this.vornoiBufferArrays.a_origin.drawType = gl.STATIC_DRAW;
		this.vornoiBufferArrays.a_position.data = new Float32Array([...this.offsets]);
		this.vornoiBufferArrays.a_arc_id.data = new Int32Array([...this.offsetArcIds]);
		this.vornoiBufferArrays.a_origin.data = new Float32Array([...this.offsets]);
		this.vornoiBufferInfo = twgl.createBufferInfoFromArrays(gl, this.vornoiBufferArrays);
		this.intermediateProgram = createIntermediateProgram(gl);
		this.intermediateFrameBufferInfo = twgl.createFramebufferInfo(
			gl,
			[
				//store floating point vec4 values
				{
					internalFormat: gl.RGBA32F,
					format: gl.RGBA,
					type: gl.FLOAT,
					minMag: gl.NEAREST,
				},
			],
			this.offsets.length / 2,
			textureHeight
		);
		this.intermediateBufferInfo = twgl.createBufferInfoFromArrays(gl, this.intermediateBufferArrays);
		this.transformFeedbackProgram = createTransformFeedbackProgram(gl);
		this.feedbackVoaInfo = twgl.createVertexArrayInfo(gl, this.transformFeedbackProgram, this.vornoiBufferInfo);
	}

	/**
	 * @param stencil [x1 ,y1, id1, ... xn, yn, idn]
	 * where 'x' and 'y' are vertexes of a trianguled polygone and 'id' is a unique integer id of the particluar polygone to which the vertex pair belong
	 */
	updateStencil(stencil: number[]) {
		this.stencil = stencil;
		this.stencilBufferArrays.a_position.data = new Float32Array(this.stencil);
		this.gl.deleteBuffer(this.stencilBufferInfo.attribs!.a_position.buffer);
		this.gl.deleteTexture(this.stencilFrameBufferInfo.attachments[0]);
		this.gl.deleteFramebuffer(this.stencilFrameBufferInfo.framebuffer);
		this.stencilBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.stencilBufferArrays);
		this.stencilFrameBufferInfo = twgl.createFramebufferInfo(
			this.gl,
			[
				//we only need 1 and 0 for the stencil.
				{
					internalFormat: this.gl.R32I,
					format: this.gl.RED_INTEGER,
					type: this.gl.INT,
					minMag: this.gl.NEAREST,
				},
			],
			this.textureWidth,
			this.textureHeight
		);
	}

	/**
	 *
	 * @param offsets [x1, y1, ... xn, yn] cooridnates of the seed points for the initial vornoi cells
	 * @param offsetArcIds [id1, id1, ... idn, idn] length = offsets.length / 2. integer ids of the polygone boundry the contains the corresponding x, y offests.
	 */

	updateOffsets(offsets: number[], offsetArcIds: number[]) {
		// const { gl, textureHeight, transformFeedback, vornoiBufferArrays } = this
		this.gl.deleteTexture(this.intermediateFrameBufferInfo.attachments[0]);
		this.gl.deleteFramebuffer(this.intermediateFrameBufferInfo.framebuffer);
		this.gl.deleteBuffer(this.vornoiBufferInfo.attribs!.a_position.buffer);
		this.gl.deleteBuffer(this.vornoiBufferInfo.attribs!.a_arc_id.buffer);
		this.gl.deleteBuffer(this.vornoiBufferInfo.attribs!.a_origin.buffer);
		this.gl.deleteTransformFeedback(this.transformFeedback);
		this.offsets = offsets;
		this.offsetArcIds = offsetArcIds;
		this.vornoiBufferArrays.a_position.data = new Float32Array([...offsets]);
		this.vornoiBufferArrays.a_arc_id.data = new Int32Array([...offsetArcIds]);
		this.vornoiBufferArrays.a_origin.data = new Float32Array([...offsets]);
		this.vornoiBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.vornoiBufferArrays);

		this.intermediateFrameBufferInfo = twgl.createFramebufferInfo(
			this.gl,
			[
				//store floating point vec4 values
				{
					internalFormat: this.gl.RGBA32F,
					format: this.gl.RGBA,
					type: this.gl.FLOAT,
					minMag: this.gl.NEAREST,
				},
			],
			this.vornoiBufferArrays.a_position.data.length / this.vornoiBufferArrays.a_position.numComponents,
			this.textureHeight
		);
		this.transformFeedback = this.gl.createTransformFeedback()!;
		this.feedbackVoaInfo = twgl.createVertexArrayInfo(this.gl, this.transformFeedbackProgram, this.vornoiBufferInfo);

		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
		//bind hte voroni buffer to the transfrom feedback object
		//the feedback program will write to this buffer
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.vornoiBufferInfo.attribs!.a_position.buffer);
		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	/**
	 * render the background polygones to an uint texture. Each poly gone will be colored accroding to its unique integer id
	 */
	renderStencil() {
		this.gl.useProgram(this.stencilProgram.program);
		twgl.setBuffersAndAttributes(this.gl, this.stencilProgram, this.stencilBufferInfo);
		//set the background 'color' to -1//

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.stencilFrameBufferInfo.framebuffer);
		this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.stencilFrameBufferInfo.attachments[0], 0);
		this.gl.viewport(0, 0, this.textureWidth, this.textureHeight);
		this.gl.clearBufferiv(this.gl.COLOR, 0, new Int32Array([-1, 0, 0, 0]));
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.stencil.length / this.stencilBufferInfo.attribs!.a_position!.numComponents!);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		// const debugColors: number[] = [] 
		// const arcIds = new Set(this.offsetArcIds);
		// for (let i = 0; i < 200; i++) {
		// 	debugColors.push(Math.random(), Math.random(), Math.random());
		// }
		// this.debug("u_stencil", this.stencilFrameBufferInfo.attachments[0], debugColors)
	}
	/**
	 * render vornoi cells to a uint texture. Each cell is colord according to its index in the offsets array. this servers as its unique id.
	 * each cell will only be drawn to the canvas if its corresponding arc_id matches the id of the pixel from the stencil texture
	 */
	renderVornoi() {
		if (this.offsets.length > 0) {
			this.gl.useProgram(this.vornoiProgram.program);
			twgl.setBuffersAndAttributes(this.gl, this.vornoiProgram, this.vornoiBufferInfo);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.vornoiFrameBufferInfo.framebuffer);
			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.vornoiFrameBufferInfo.attachments[0], 0);
			this.gl.viewport(0, 0, this.textureWidth, this.textureHeight);
			const uniforms = {
				u_stencil: this.stencilFrameBufferInfo.attachments[0],
				u_background_index: this.offsets.length / 3 + 1,
			};
			twgl.setUniforms(this.vornoiProgram, uniforms);
			//set the background 'color' to -1//
			this.gl.clearBufferiv(this.gl.COLOR, 0, new Int32Array([-1, 0, 0, 0]));
			this.gl.enable(this.gl.DEPTH_TEST);
			this.gl.depthFunc(this.gl.LEQUAL);
			this.gl.clearDepth(1);
			this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
			this.gl.drawArraysInstanced(
				this.gl.TRIANGLE_FAN,
				0,
				this.vornoiBufferArrays.a_instance.data.length / this.vornoiBufferArrays.a_instance.numComponents,
				this.vornoiBufferArrays.a_position.data.length / this.vornoiBufferArrays.a_position.numComponents
			);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
			this.gl.disable(this.gl.DEPTH_TEST);
			// const debugColors: number[] = [];
			// for (let i = 0; i < (this.vornoiBufferArrays.a_position.data.length / this.vornoiBufferArrays.a_position.numComponents) + 1; i++){
			// 	debugColors.push(Math.random(), Math.random(), Math.random())
			// }
			// // console.log("debug colors", debugColors)
			// this.debug("u_vornoi", this.vornoiFrameBufferInfo.attachments[0], debugColors)
		}
	}

	/**
	 * render sums to a texture that has deminention number_of_cells X vornoi_texture_height.
	 * where the "columns" (the x coordinates) are the id of each vornoi cell and the "rows" (the y coordinates) are the sum of all that cell's pixles along the coresponding row in the vornoi texture
	 */
	renderIntermediateTexture() {
		if (this.offsets.length > 0) {
			//read from the red texture, containing the voroni cells
			//write to the column texture, containing the column sums
			this.gl.useProgram(this.intermediateProgram.program);
			twgl.setBuffersAndAttributes(this.gl, this.intermediateProgram, this.intermediateBufferInfo);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.intermediateFrameBufferInfo.framebuffer);
			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.intermediateFrameBufferInfo.attachments[0], 0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.vornoiFrameBufferInfo.attachments[0]);
			this.gl.clearBufferfv(this.gl.COLOR, 0, new Float32Array([-1, 0, 0, 1]));
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		}
	}

	/**
	 * sum along the columns of the intermediate texture and write the resulting vec2 into the vornoi buffer to seed the next round
	 */
	transformFeedbackStep() {
		//read from the intermediate texture and use transfrom feedback to write to the buffer for the voroni program
		this.gl.useProgram(this.transformFeedbackProgram.program);
		twgl.setBuffersAndAttributes(this.gl, this.transformFeedbackProgram, this.feedbackVoaInfo);

		this.gl.enable(this.gl.RASTERIZER_DISCARD);

		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.vornoiBufferInfo.attribs!.a_position.buffer);
		this.gl.beginTransformFeedback(this.gl.POINTS);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.intermediateFrameBufferInfo.attachments[0]);
		this.gl.drawArrays(this.gl.POINTS, 0, this.offsets.length / 2);
		this.gl.endTransformFeedback();
		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
		this.gl.bindVertexArray(null);
		//turn on using fragment shaders again
		this.gl.disable(this.gl.RASTERIZER_DISCARD);
		this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	}

	/**
   * @param key name of a sampler uniform;
   * @param tex the texture to samplel
   * @param colors array of RGB colors. One for each unique value to display;
   * @returns displays the data on a uint texture using the provided colros;
   * 
   * 
   * ex:
   *  for (let i = 0; i < offsets.length / 2; i++) {
          debugColors.push(Math.random(), Math.random(), Math.random())
      }
   *   ... RUN RENDER CYCLE ...
   *   this.debug("u_vornoi", this.vornoiFrameBufferInfo.attachments[0], debugColors)
   */
	debug(key: string, tex: WebGLTexture, colors: number[]) {
		if (this) {
			const { gl, quad } = this;
			if (colors.length > 0) {
				const vertexShaderSource = `#version 300 es
            layout(location = 0) in vec2 a_position;
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
            }
            `;
				const fragmentShaderSource = `#version 300 es
            precision mediump float;
            uniform vec3 colors[${colors.length}];
            uniform mediump isampler2D ${key};
            out vec4 outColor;
            void main() {
              ivec2 coord = ivec2(gl_FragCoord.xy);
              ivec4 t = texelFetch(${key}, coord, 0);
              outColor = vec4(colors[t.r], 1);
            }
            // `;

				const uniforms = {
					[key]: tex,
				};
				const debugProgramInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource], {
					attribLocations: {
						a_position: 0,
					},
				});

				const debugBufferArrays: twgl.Arrays = {
					a_position: {
						numComponents: 2,
						data: quad,
						drawType: gl.STATIC_DRAW,
					},
				};
				const debugBufferInto = twgl.createBufferInfoFromArrays(gl, debugBufferArrays);

				gl.useProgram(debugProgramInfo.program);
				twgl.setBuffersAndAttributes(gl, debugProgramInfo, debugBufferInto);
				const arrayUniform = gl.getUniformLocation(debugProgramInfo.program, "colors");
				gl.uniform3fv(arrayUniform, new Float32Array(colors));
				gl.clearColor(-1, 0, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);
				twgl.setUniforms(debugProgramInfo, uniforms);
				gl.drawArrays(gl.TRIANGLES, 0, quad.length / 2);
			}
		}
	}

	render() {
		// const debugColors: number[] = [];
		// const numberOfArcs = new Set(this.offsetArcIds)
		// for (let i = 0; i < numberOfArcs.size + 1; i++) {
		//     debugColors.push(Math.random(), Math.random(), Math.random())
		// }
		//   for (let i = 0; i < this.offsets.length; i += 2) {
		//     debugColors.push(Math.random(), Math.random(), Math.random())
		// }
		for (let i = 0; i < this.cycles; i++) {
			this.gl.flush();
			this.renderVornoi();
			this.renderIntermediateTexture();
			this.transformFeedbackStep();
		}
		// this.debug("u_arc", this.stencilFrameBufferInfo.attachments[0],debugColors)
		// this.debug("u_vornoi", this.vornoiFrameBufferInfo.attachments[0], debugColors)
		return this.getBatchPositions();
	}

	async renderInChunks(offsets: number[], offsetArcIds: number[]) {
		let currentArc = 0,
			currentVectors: number[] = [],
			currentArcIndexes: number[] = [];

		for (let i = 0; i < offsets.length; i += 2) {
			//try to group arcs by 100
			if (currentVectors.length > 200 && currentArc !== offsetArcIds[Math.floor((i + 1) / 2)]) {
				this.updateOffsets(currentVectors, currentArcIndexes);
				this.keepOpen = true;
				await this.render();
				this.keepOpen = false;
				console.log("rendered chunk ", currentVectors.length / 2, " vectors");
				currentVectors = [];
				currentArcIndexes = [];
			}
			currentArc = offsetArcIds[Math.floor((i + 1) / 2)];
			currentVectors.push(offsets[i], offsets[i + 1]);
			currentArcIndexes.push(offsetArcIds[Math.floor((i + 1) / 2)]);
		}
		if (currentArcIndexes.length > 0) {
			console.log("rendered chunk ", currentVectors.length / 2, " vectors");
			this.updateOffsets(currentVectors, currentArcIndexes);
			this.render();
		}
	}

	getBatchPositions() {
		const fence = this.gl.fenceSync(this.gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
		const { keepOpen } = this;
		this.gl.flush();
		return new Promise((resolve) => {
			const waitForResult = () => {
				const status = this.gl.clientWaitSync(fence!, 0, 0);
				if (status === this.gl.CONDITION_SATISFIED || status === this.gl.ALREADY_SIGNALED) {
					this.gl.deleteSync(fence);
					const output = new Float32Array(this.offsets.length);
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vornoiBufferInfo.attribs!.a_position.buffer);
					this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, output);
					this.callBack({ payload: output, keepOpen });
					resolve("done");
				} else {
					setTimeout(waitForResult);
				}
			};
			setTimeout(waitForResult);
		});
	}

	getPositions() {
		const fence = this.gl.fenceSync(this.gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
		const { keepOpen } = this;
		this.gl.flush();
		const waitForResult = () => {
			const status = this.gl.clientWaitSync(fence!, 0, 0);
			if (status === this.gl.CONDITION_SATISFIED || status === this.gl.ALREADY_SIGNALED) {
				this.gl.deleteSync(fence);
				const output = new Float32Array(this.offsets.length);
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vornoiBufferInfo.attribs!.a_position.buffer);
				this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, output);
				this.callBack({ payload: output, keepOpen });
			} else {
				setTimeout(waitForResult);
			}
		};
		setTimeout(waitForResult);
	}
}
