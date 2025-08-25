export default class Renderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private testProgram: WebGLProgram | null = null;
  private testBuffer: WebGLBuffer | null = null;
  private aPositionLoc: number = -1;
  private uPVLoc: WebGLUniformLocation | null = null;
  private gridBuffer: WebGLBuffer | null = null;
  private gridCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl;

    this.enableDefaults();
    this.initTestGeometry(); // <-- setup simple triangle
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private enableDefaults() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
  }

  private initTestGeometry() {
    const gl = this.gl;

    // Simple vertex + fragment shader (clip-space triangle)
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uPV;
      void main() {
        vec4 pos = vec4(aPosition.xy, aPosition.z, 1.0);
        // if uPV is identity or not set, multiplication is harmless
        gl_Position = uPV * pos;
      }
    `;
    const fsSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.6, 0.2, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error('Shader compile failed: ' + info);
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error('Program link failed: ' + info);
    }

    // Triangle in clip space
    const vertices = new Float32Array([
      0.0,  0.6,
     -0.6, -0.6,
      0.6, -0.6,
    ]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // simple grid in XZ plane (y=0) centered around origin
    const gridLines: number[] = [];
    const size = 10;
    const step = 1;
    for (let i = -size; i <= size; i += step) {
      // line parallel to X
      gridLines.push(-size, 0, i);
      gridLines.push(size, 0, i);
      // line parallel to Z
      gridLines.push(i, 0, -size);
      gridLines.push(i, 0, size);
    }
    const gridArr = new Float32Array(gridLines);
    const gbuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, gbuf);
    gl.bufferData(gl.ARRAY_BUFFER, gridArr, gl.STATIC_DRAW);

    this.gridBuffer = gbuf;
    this.gridCount = gridArr.length / 3;

  this.testProgram = program;
    this.testBuffer = buf;
    this.aPositionLoc = gl.getAttribLocation(program, 'aPosition');
  // optional: uniform for projection*view matrix
  this.uPVLoc = gl.getUniformLocation(program, 'uPV');
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  beginFrame() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  // Minimal rendering hook used von renderSystem.updateRender
  renderWorld(_world: any, _viewMatrix: any, projection?: Float32Array) {
    const gl = this.gl;
    if (!this.testProgram || !this.testBuffer) return;
    gl.useProgram(this.testProgram);

    // draw grid if available
    if (this.gridBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
      gl.enableVertexAttribArray(this.aPositionLoc);
      // interpret attribute as vec3 for grid
      gl.vertexAttribPointer(this.aPositionLoc, 3, gl.FLOAT, false, 0, 0);
      if (projection && this.uPVLoc) {
        gl.uniformMatrix4fv(this.uPVLoc, false, projection);
      }
      gl.lineWidth(1);
      gl.drawArrays(gl.LINES, 0, this.gridCount);
      gl.disableVertexAttribArray(this.aPositionLoc);
    }

    // draw triangle (debug)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.testBuffer);
    gl.enableVertexAttribArray(this.aPositionLoc);
    gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    if (projection && this.uPVLoc) {
      gl.uniformMatrix4fv(this.uPVLoc, false, projection);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(this.aPositionLoc);
  }

  // Optional helper if renderSystem wants to set viewport explicitly
  setViewport(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}