import svgPathCommander from "svg-path-commander";
import { stencilShaderSource } from "@/app/libs/webgl/shaders/stencilShaderSource";
import earcut from "earcut";
import * as Comlink from "comlink";
import * as twgl from "twgl.js";
class ShapeWorker {
	sections: Section[] = [];
	boundries: { [sectionID: string]: number[] } = {};
	numPoints: number = 100;
	canvas: OffscreenCanvas | null = null;
	gl: WebGL2RenderingContext | null = null;
	textureWidth = 312;
	textureHeight = 312;
      quad = new Float32Array([
    // First triangle:
    1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    // Second triangle:
    -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
  ]);

	constructor() {}

	// this is a slow meothd. Think about streaming these results to voronoi generator.
	// look at some of the methods here https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
	addSections = async (sections: Section[], generator: any) => {
		const { canvas } = this;
		if (!canvas) return;
		this.sections = sections;
		let id = 0;
		for await (const section of sections) {
			const points: number[] = [];
			const triangles: number[] = [];
			// Comlink.proxy is awaitable. But apparently, js doesn't know that.
			const path = await generator(section);
			const length = svgPathCommander.getTotalLength(path || "");

			for (let i = 0; i < this.numPoints; i++) {
				const { x, y } = svgPathCommander.getPointAtLength(path || "", (i / this.numPoints) * length);
				points.push(x, y);
			}
			const ears = earcut(points); //<--returns the indexes of x coordinates of the triangle vertices in the points array
			for (let i = 0; i < ears.length; i++) {
				const index = ears[i] * 2;
				triangles.push((points[index]/ 1122) * 2, (points[index + 1]/ 1122) * 2, id);
			}
			this.boundries[section.id] = triangles;
            id++;
		}
		this.renderStencil();
	};

	transferCanvas = (canvas: OffscreenCanvas) => {
		this.canvas = canvas;
		this.gl = canvas.getContext("webgl2");
	};

	/**
	 * render the background polygones to a uint texture. Each poly gone will be colored accroding to its unique integer id
	 */
	renderStencil() {
		if (!this.gl || !this.canvas) {
			return;
		}
		let stencil: number[] = [];
		this.sections.forEach((section, i) => {
			// i is the id of the section, for now. Next step is to assign unique integer ids to each section id.
			stencil.push(...this.boundries[section.id]);
		});
		const stencilProgram = twgl.createProgramInfo(this.gl, [stencilShaderSource.vertex, stencilShaderSource.fragment], {
			attribLocations: {
				a_position: 0,
			},
		});

		const stencilBufferArrays = {
			a_position: {
				numComponents: 3,
				data: new Float32Array(stencil.flat()),
				drawType: this.gl.STATIC_DRAW,
			},
		};
        const debugColors = []
        for (let i = 0; i < Object.keys(this.sections).length; i++) {
            debugColors.push(Math.random(), Math.random(), Math.random())
        }

		const stencilBufferInfo = twgl.createBufferInfoFromArrays(this.gl, stencilBufferArrays);
		const stencilFrameBufferInfo = twgl.createFramebufferInfo(
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
		this.gl.useProgram(stencilProgram.program);
		twgl.setBuffersAndAttributes(this.gl, stencilProgram, stencilBufferInfo);
		//set the background 'color' to -1//
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, stencilFrameBufferInfo.framebuffer);
		this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, stencilFrameBufferInfo.attachments[0], 0);
		this.gl.viewport(0, 0, this.textureWidth, this.textureHeight);
		this.gl.clearBufferiv(this.gl.COLOR, 0, new Int32Array([-1, 0, 0, 0]));
		this.gl.drawArrays(this.gl.TRIANGLES, 0, stencil.length / stencilBufferInfo.attribs!.a_position!.numComponents!);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		this.debug("u_stencil", stencilFrameBufferInfo.attachments[0], debugColors)
	}

	debug(key: string, tex: WebGLTexture, colors: number[]) {
		if (this) {
			const { gl, quad } = this;
            if (!gl) return;``
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

	render = () => {
		const { gl } = this;
		if (gl) {
			let triangles: number[] = [];
			this.sections.forEach((section) => {
				triangles = [...triangles, ...this.boundries[section.id]];
			});

			// const triangles = this.boundries[section.id];
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			gl.drawArrays(gl.TRIANGLES, 0, triangles.length / 2);
		}
	};
}

Comlink.expose(ShapeWorker);
export { ShapeWorker };
