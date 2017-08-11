import { Game } from '../game'
import { Shader } from './shader'
import { RenderTarget } from './renderTarget'
import { Texture } from './texture'
import { Rectangle } from '../util/rectangle'
import { Color } from '../util/color'
import { UniformType, setUniformValue } from './uniform'
import { AttributeType } from './attribute'
import { Shaders } from './shaders'
import { Matrix, Vec2 } from '../math'

export interface BlendMode { source: number; dest: number }
const BlendModes: { [name: string]: BlendMode } = {}

export class Graphics {
  canvas: HTMLCanvasElement | null
  gl: WebGLRenderingContext
  buffer: RenderTarget | null
  orthographic: Matrix = Matrix.IDENTITY()
  drawCalls: number = 0
  resolutionStyle: ResolutionStyle = ResolutionStyle.Fill
  borderColor: Color = Color.red.clone()
  clearColor: Color = new Color(0.1, 0.1, 0.3, 1)

  private toScreen: Matrix = Matrix.IDENTITY()

  private vertices: number[] = []
  private texcoords: number[] = []
  private colors: number[] = []

  private currentTarget: RenderTarget | null

  private vertexBuffer: WebGLBuffer | null
  private texcoordBuffer: WebGLBuffer | null
  private colorBuffer: WebGLBuffer | null

  private currentShader: Shader | null
  private nextShader: Shader | null

  private currentBlendMode: BlendMode | null
  private nextBlendMode: BlendMode | null

  private _pixel: Texture
  private _pixelUVs: Vec2[] = [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(1, 1),
    new Vec2(0, 1),
  ]
  private _defaultPixel: Texture

  get pixel(): Texture {
    return this._pixel
  }
  set pixel(p: Texture) {
    if (!p) {
      p = this._defaultPixel
    }
    const minX = p.bounds.left / p.width
    const minY = p.bounds.top / p.height
    const maxX = p.bounds.right / p.width
    const maxY = p.bounds.bottom / p.height

    this._pixel = p
    this._pixelUVs = [
      new Vec2(minX, minY),
      new Vec2(maxX, minY),
      new Vec2(maxX, maxY),
      new Vec2(minX, maxY),
    ]
  }

  get shader(): Shader | null {
    return this.nextShader || this.currentShader
  }
  set shader(s: Shader | null) {
    if (this.shader !== s && s !== null) {
      this.nextShader = s
    }
  }

  get blendMode(): BlendMode | null {
    return this.nextBlendMode || this.currentBlendMode
  }
  set blendMode(bm: BlendMode | null) {
    if (this.currentBlendMode !== bm && bm) {
      this.nextBlendMode = bm
    }
  }

  constructor() {
    this.canvas = document.createElement('canvas')
    this.gl = this.createContext(this.canvas, {
      alpha: false,
      antialias: false,
      stencil: true,
    })
    Game.root.appendChild(this.canvas)

    this.gl.enable(this.gl.BLEND)
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA)

    BlendModes.normal = {
      source: this.gl.ONE,
      dest: this.gl.ONE_MINUS_SRC_ALPHA,
    }
    BlendModes.add = { source: this.gl.ONE, dest: this.gl.DST_ALPHA }
    BlendModes.multiply = {
      source: this.gl.DST_COLOR,
      dest: this.gl.ONE_MINUS_SRC_ALPHA,
    }
    BlendModes.screen = {
      source: this.gl.ONE,
      dest: this.gl.ONE_MINUS_SRC_COLOR,
    }
    this.currentBlendMode = BlendModes.normal

    this.vertexBuffer = this.gl.createBuffer()
    this.texcoordBuffer = this.gl.createBuffer()
    this.colorBuffer = this.gl.createBuffer()
  }

  load() {
    this.pixel = this._defaultPixel = Texture.createFromData([1, 1, 1, 1], 1, 1)
  }

  unload() {
    this._defaultPixel.dispose()
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.colorBuffer)
    this.gl.deleteBuffer(this.texcoordBuffer)
    if (this.buffer) this.buffer.dispose()
    this.buffer = null
    if (this.canvas) this.canvas.remove()
    this.canvas = null

    // TODO: Why?
  }

  private createContext(
    canvas: HTMLCanvasElement,
    opts: WebGLContextAttributes
  ) {
    const gl =
      canvas.getContext('webgl', opts) ||
      canvas.getContext('experimental-webgl', opts)
    if (!gl) {
      throw new Error('This browser does not support WebGL')
    }
    return gl
  }

  resize() {
    if (this.buffer) this.buffer.dispose()
    this.buffer = RenderTarget.create(Game.width, Game.height)

    this.orthographic
      .identity()
      .translate(-1, 1)
      .scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2)
  }

  update() {
    if (this.canvas) {
      if (
        this.canvas.width !== Game.root.clientWidth ||
        this.canvas.height !== Game.root.clientHeight
      ) {
        this.canvas.width = Game.root.clientWidth
        this.canvas.height = Game.root.clientHeight
      }
    }
  }

  getOutputBounds(): Rectangle {
    let scaleX = 1
    let scaleY = 1

    switch (this.resolutionStyle) {
      case ResolutionStyle.Exact:
        scaleX = this.canvas.width / this.buffer.width
        scaleY = this.canvas.height / this.buffer.height
        break
      case ResolutionStyle.Contain:
        scaleX = scaleY = Math.min(
          this.canvas.width / this.buffer.width,
          this.canvas.height / this.buffer.height
        )
        break
      case ResolutionStyle.ContainInteger:
        scaleX = scaleY = Math.floor(
          Math.min(
            this.canvas.width / this.buffer.width,
            this.canvas.height / this.buffer.height
          )
        )
        break
      case ResolutionStyle.Fill:
        scaleX = scaleY = Math.max(
          this.canvas.width / this.buffer.width,
          this.canvas.height / this.buffer.height
        )
        break
      case ResolutionStyle.FillInteger:
        scaleX = scaleY = Math.ceil(
          Math.max(
            this.canvas.width / this.buffer.width,
            this.canvas.height / this.buffer.height
          )
        )
        break
      default:
        break
    }

    const width = this.buffer.width * scaleX
    const height = this.buffer.height * scaleY

    return new Rectangle(
      (this.canvas.width - width) / 2,
      (this.canvas.height - height) / 2,
      width,
      height
    )
  }

  clear(color: Color) {
    this.gl.clearColor(color.r, color.g, color.b, color.a)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  reset() {
    this.drawCalls = 0
    this.currentShader = null
    this.nextShader = null
    this.vertices = []
    this.colors = []
    this.texcoords = []
    this.setRenderTarget(this.buffer)
    this.clear(this.clearColor)
  }

  setRenderTarget(target: RenderTarget) {
    if (this.currentTarget !== target) {
      this.flush()
      if (!target) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
      } else {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.frameBuffer)
        this.gl.viewport(0, 0, target.width, target.height)
      }
      this.currentTarget = target
    }
  }

  setShaderTexture(tex: Texture) {
    if (this.shader && this.shader.sampler2D) {
      this.shader.sampler2D.value = tex.webGLTexture
    } else {
      throw new Error('This shader does not have a texture to be set')
    }
  }

  checkState() {
    if (
      this.nextShader ||
      this.nextBlendMode ||
      (this.currentShader && this.currentShader.dirty)
    ) {
      if (this.currentShader) {
        this.flush()
      }

      const swapped = !!this.nextShader
      if (swapped) {
        if (this.currentShader) {
          for (const attribute of this.currentShader.attributes) {
            this.gl.disableVertexAttribArray(attribute.attribute)
          }
        }

        this.currentShader = this.nextShader
        this.nextShader = null
        this.gl.useProgram(this.currentShader.program)

        for (const attribute of this.currentShader.attributes) {
          this.gl.enableVertexAttribArray(attribute.attribute)
        }
      }

      if (this.nextBlendMode) {
        this.currentBlendMode = this.nextBlendMode
        this.nextBlendMode = null
        this.gl.blendFunc(
          this.currentBlendMode.source,
          this.currentBlendMode.dest
        )
      }

      let textureCounter = 0
      for (const uniform of this.currentShader.uniforms) {
        const location = uniform.uniform

        if (swapped || uniform.dirty) {
          if (uniform.type === UniformType.sampler2D) {
            this.gl.activeTexture(
              (this.gl as any)[`TEXTURE${textureCounter}`] as number
            )
            if (uniform.value instanceof Texture) {
              this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                uniform.value.webGLTexture
              )
            } else if (uniform.value instanceof RenderTarget) {
              this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                uniform.value.texture.webGLTexture
              )
            } else {
              this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value)
            }
            this.gl.uniform1i(location, textureCounter)
            textureCounter += 1
          } else {
            setUniformValue[uniform.type as string](
              this.gl,
              uniform.uniform,
              uniform.value
            )
          }

          uniform.dirty = false
        }
      }
      this.currentShader.dirty = false
    }
  }

  flush(mode: number = this.gl.TRIANGLES) {
    if (this.vertices.length > 0) {
      for (const attr of this.currentShader.attributes) {
        switch (attr.type) {
          case AttributeType.Position:
            this.gl.bindBuffer(
              this.gl.ARRAY_BUFFER,
              this.currentTarget
                ? this.currentTarget.vertexBuffer
                : this.vertexBuffer
            )
            this.gl.bufferData(
              this.gl.ARRAY_BUFFER,
              new Float32Array(this.vertices),
              this.gl.STATIC_DRAW
            )
            this.gl.vertexAttribPointer(
              attr.attribute,
              2,
              this.gl.FLOAT,
              false,
              0,
              0
            )
            break
          case AttributeType.Texcoord:
            this.gl.bindBuffer(
              this.gl.ARRAY_BUFFER,
              this.currentTarget
                ? this.currentTarget.texcoordBuffer
                : this.texcoordBuffer
            )
            this.gl.bufferData(
              this.gl.ARRAY_BUFFER,
              new Float32Array(this.texcoords),
              this.gl.STATIC_DRAW
            )
            this.gl.vertexAttribPointer(
              attr.attribute,
              2,
              this.gl.FLOAT,
              false,
              0,
              0
            )
            break
          case AttributeType.Color:
            this.gl.bindBuffer(
              this.gl.ARRAY_BUFFER,
              this.currentTarget
                ? this.currentTarget.colorBuffer
                : this.colorBuffer
            )
            this.gl.bufferData(
              this.gl.ARRAY_BUFFER,
              new Float32Array(this.colors),
              this.gl.STATIC_DRAW
            )
            this.gl.vertexAttribPointer(
              attr.attribute,
              4,
              this.gl.FLOAT,
              false,
              0,
              0
            )
            break
          default:
            break
        }
      }
      this.gl.drawArrays(mode, 0, this.vertices.length / 2)
      this.drawCalls++

      this.vertices = []
      this.texcoords = []
      this.colors = []
    }
  }

  finalize() {
    this.setRenderTarget(null)
    this.clear(this.borderColor)

    this.toScreen
      .identity()
      .translate(-1, -1)
      .scale(1 / this.canvas.width * 2, 1 / this.canvas.height * 2)

    this.shader = Shaders.texture
    this.shader.sampler2D.value = this.buffer.texture.webGLTexture
    this.shader.set('matrix', this.toScreen)

    const bounds = this.getOutputBounds()
    this.push(bounds.left, bounds.top, 0, 0, Color.white)
    this.push(bounds.right, bounds.top, 1, 0, Color.white)
    this.push(bounds.right, bounds.bottom, 1, 1, Color.white)
    this.push(bounds.left, bounds.top, 0, 0, Color.white)
    this.push(bounds.right, bounds.bottom, 1, 1, Color.white)
    this.push(bounds.left, bounds.bottom, 0, 1, Color.white)
    this.flush()
  }

  push(x: number, y: number, u: number, v: number, color?: Color) {
    this.checkState()

    this.vertices.push(x, y)
    this.texcoords.push(u, v)
    if (color) {
      this.colors.push(color.r, color.g, color.b, color.a)
    }
  }

  pushUnsafe(x: number, y: number, u: number, v: number, color?: Color) {
    this.vertices.push(x, y)
    this.texcoords.push(u, v)
    if (color) {
      this.colors.push(color.r, color.g, color.b, color.a)
    }
  }

  pushList(pos: Vec2[], uv: Vec2[], color: Color[]) {
    this.checkState()

    for (let i = 0; i < pos.length; i++) {
      this.vertices.push(pos[i].x, pos[i].y)
      this.texcoords.push(uv[i].x, uv[i].y)
      if (color) {
        const c = color[i]
        this.colors.push(c.r, c.g, c.b, c.a)
      }
    }
  }

  private topLeft = new Vec2()
  private topRight = new Vec2()
  private botLeft = new Vec2()
  private botRight = new Vec2()
  private texToDraw = new Texture(null, 0, 0, new Rectangle())

  private scaledOrigin = new Vec2()

  texture(
    tex: Texture,
    mat: Matrix,
    origin?: Vec2,
    crop?: Rectangle,
    color?: Color,
    flipX?: boolean,
    flipY?: boolean
  ) {
    this.setShaderTexture(tex)

    let t: Texture
    if (!crop) {
      t = tex
    } else {
      t = tex.getSubtexture(crop, this.texToDraw)
    }
    const left = 0
    const top = 0
    const width = t.bounds.width
    const height = t.bounds.height

    this.topLeft.set(left, top)
    this.topRight.set(left + width, top)
    this.botLeft.set(left, top + height)
    this.botRight.set(left + width, top + height)

    if (origin && (origin.x !== 0 || origin.y !== 0)) {
      this.scaledOrigin.set(
        origin.x * t.bounds.width,
        origin.y * t.bounds.width
      )
      this.topLeft.sub(this.scaledOrigin)
      this.topRight.sub(this.scaledOrigin)
      this.botLeft.sub(this.scaledOrigin)
      this.botRight.sub(this.scaledOrigin)
    }

    // TODO: Would it be better to do this in the shader?
    this.topLeft = mat.transformPoint(this.topLeft)
    this.topRight = mat.transformPoint(this.topRight)
    this.botLeft = mat.transformPoint(this.botLeft)
    this.botRight = mat.transformPoint(this.botRight)

    let uvMinX = t.bounds.x / t.texWidth
    let uvMinY = t.bounds.y / t.texHeight
    let uvMaxX = uvMinX + width / t.texWidth
    let uvMaxY = uvMinY + height / t.texHeight
    if (flipX) {
      const a = uvMinX
      uvMinX = uvMaxX
      uvMaxX = a
    }

    if (flipY) {
      const b = uvMinY
      uvMinY = uvMaxY
      uvMaxY = b
    }

    const col = color || Color.white
    this.push(this.topLeft.x, this.topLeft.y, uvMinX, uvMinY, col)
    this.pushUnsafe(this.topRight.x, this.topRight.y, uvMaxX, uvMinY, col)
    this.pushUnsafe(this.botRight.x, this.botRight.y, uvMaxX, uvMaxY, col)
    this.pushUnsafe(this.topLeft.x, this.topLeft.y, uvMinX, uvMinY, col)
    this.pushUnsafe(this.botRight.x, this.botRight.y, uvMaxX, uvMaxY, col)
    this.pushUnsafe(this.botLeft.x, this.botLeft.y, uvMinX, uvMaxY, col)
  }

  quad(
    a: Vec2,
    b: Vec2,
    c: Vec2,
    d: Vec2,
    colA: Color,
    colB: Color,
    colC: Color,
    colD: Color
  ) {
    if (this.shader && this.shader.sampler2D) {
      this.setShaderTexture(this._pixel)
    }

    if (!colB) colB = colA
    if (!colC) colC = colA
    if (!colD) colD = colA

    const uv = this._pixelUVs
    this.push(a.x, a.y, uv[0].x, uv[0].y, colA)
    this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB)
    this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC)
    this.pushUnsafe(a.x, a.y, uv[0].x, uv[0].y, colA)
    this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC)
    this.pushUnsafe(d.x, d.y, uv[3].x, uv[3].y, colD)
  }

  rect(x: number, y: number, width: number, height: number, color: Color) {
    if (this.shader && this.shader.sampler2D) {
      this.setShaderTexture(this._pixel)
    }

    const uv = this._pixelUVs
    this.push(x, y, uv[0].x, uv[0].y, color)
    this.pushUnsafe(x + width, y, uv[1].x, uv[1].y, color)
    this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color)
    this.pushUnsafe(x, y, uv[0].x, uv[0].y, color)
    this.pushUnsafe(x, y + height, uv[3].x, uv[3].y, color)
    this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color)
  }

  triangle(a: Vec2, b: Vec2, c: Vec2, colA: Color, colB: Color, colC: Color) {
    if (this.shader && this.shader.sampler2D) {
      this.setShaderTexture(this._pixel)
    }

    if (!colB) colB = colA
    if (!colC) colC = colA

    const uv = this._pixelUVs
    this.push(a.x, a.y, uv[0].x, uv[0].y, colA)
    this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB)
    this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC)
  }

  circle(pos: Vec2, rad: number, steps: number, color: Color) {
    if (this.shader && this.shader.sampler2D) {
      this.setShaderTexture(this._pixel)
    }

    this.checkState()

    const uv = this._pixelUVs
    let last = new Vec2(pos.x + rad, pos.y)
    for (let i = 1; i <= steps; i++) {
      const angle = i / steps * Math.PI * 2
      const next = new Vec2(pos.x + Math.cos(angle), pos.y + Math.sin(angle))

      this.pushUnsafe(pos.x, pos.y, uv[0].x, uv[0].y, color)
      this.pushUnsafe(last.x, last.y, uv[1].x, uv[1].y, color)
      this.pushUnsafe(next.x, next.y, uv[2].x, uv[2].y, color)
      last = next
    }
  }

  hollowRect(
    x: number,
    y: number,
    width: number,
    height: number,
    stroke: number,
    color: Color
  ) {
    this.rect(x, y, width, stroke, color)
    this.rect(x, y + stroke, stroke, height - stroke * 2, color)
    this.rect(
      x + width - stroke,
      y + stroke,
      stroke,
      height - stroke * 2,
      color
    )
    this.rect(x, y + height - stroke, width, stroke, color)
  }

  draw(ri: RenderInstruction) {
    switch (ri.type) {
      case RenderInstructionType.TEXTURE:
        this.texture(
          ri.tex,
          ri.mat,
          ri.origin,
          ri.crop,
          ri.color,
          ri.flipX,
          ri.flipY
        )
        break
      case RenderInstructionType.QUAD:
        this.quad(ri.a, ri.b, ri.c, ri.d, ri.colA, ri.colB, ri.colC, ri.colD)
        break
      case RenderInstructionType.RECT:
        this.rect(ri.x, ri.y, ri.width, ri.height, ri.color)
        break
      case RenderInstructionType.TRIANGLE:
        this.triangle(ri.a, ri.b, ri.c, ri.colA, ri.colB, ri.colC)
        break
      case RenderInstructionType.CIRCLE:
        this.circle(ri.pos, ri.rad, ri.steps, ri.color)
        break
      case RenderInstructionType.HOLLOWRECT:
        this.hollowRect(ri.x, ri.y, ri.width, ri.height, ri.stroke, ri.color)
        break
      default:
        break
    }
  }
}

export enum RenderInstructionType {
  TEXTURE = 'TEXTURE',
  QUAD = 'QUAD',
  RECT = 'RECT',
  TRIANGLE = 'TRIANGLE',
  CIRCLE = 'CIRCLE',
  HOLLOWRECT = 'HOLLOWRECT',
}

export interface TextureInstruction {
  type: RenderInstructionType.TEXTURE
  tex: Texture
  mat: Matrix
  crop?: Rectangle
  color?: Color
  origin?: Vec2
  flipX?: boolean
  flipY?: boolean
}

export interface QuadInstruction {
  type: RenderInstructionType.QUAD
  a: Vec2
  b: Vec2
  c: Vec2
  d: Vec2
  colA: Color
  colB?: Color
  colC?: Color
  colD?: Color
}

export interface RectInstruction {
  type: RenderInstructionType.RECT
  x: number
  y: number
  width: number
  height: number
  color: Color
}

export interface TriangleInstruction {
  type: RenderInstructionType.TRIANGLE
  a: Vec2
  b: Vec2
  c: Vec2
  colA: Color
  colB?: Color
  colC?: Color
}

export interface CircleInstruction {
  type: RenderInstructionType.CIRCLE
  pos: Vec2
  rad: number
  steps: number
  color: Color
}

export interface HollowRectInstruction {
  type: RenderInstructionType.HOLLOWRECT
  x: number
  y: number
  width: number
  height: number
  stroke: number
  color: Color
}

export type RenderInstruction =
  | TextureInstruction
  | QuadInstruction
  | RectInstruction
  | TriangleInstruction
  | CircleInstruction
  | HollowRectInstruction

export enum ResolutionStyle {
  /** Renders the buffer at the Center of the Screen with no scaling */
  None,
  /** Renders the buffer to an exact fit of the Screen (stretching) */
  Exact,
  /** Renders the buffer so that it is contained within the Screen */
  Contain,
  /** Renders the buffer so that it is contained within the Screen, rounded to an Integer scale */
  ContainInteger,
  /** Renders the buffer so that it fills the Screen (cropping the buffer) */
  Fill,
  /** Renders the buffer so that it fills the Screen (cropping the buffer), rounded to an Integer scale */
  FillInteger,
}
