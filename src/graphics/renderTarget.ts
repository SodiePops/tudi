import { Texture } from './texture'
import { Game } from '../game'

/**
 * A RenderTarget for the engine to render image data into
 */
export class RenderTarget {
  texture: Texture
  frameBuffer: WebGLFramebuffer
  vertexBuffer: WebGLBuffer
  texcoordBuffer: WebGLBuffer
  colorBuffer: WebGLBuffer

  get width(): number {
    return this.texture.width
  }
  get height(): number {
    return this.texture.height
  }

  constructor(
    buffer: WebGLFramebuffer,
    texture: Texture,
    vert: WebGLBuffer,
    color: WebGLBuffer,
    texcoord: WebGLBuffer
  ) {
    this.texture = texture
    this.frameBuffer = buffer
    this.vertexBuffer = vert
    this.colorBuffer = color
    this.texcoordBuffer = texcoord
  }

  /**
   * Cleans up buffers to delete this RenderTarget
   */
  dispose() {
    this.texture.dispose()
    this.texture = null

    const gl = Game.graphics.gl
    gl.deleteFramebuffer(this.frameBuffer)
    gl.deleteBuffer(this.vertexBuffer)
    gl.deleteBuffer(this.texcoordBuffer)
    gl.deleteBuffer(this.colorBuffer)
    this.frameBuffer = null
    this.vertexBuffer = null
    this.texcoordBuffer = null
    this.colorBuffer = null
  }

  /**
   * Create a new RenderTarget with given width and height
   */
  static create(width: number, height: number): RenderTarget {
    const gl = Game.graphics.gl
    const frameBuffer = gl.createFramebuffer()
    const tex = gl.createTexture()

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    )

    const vertexBuffer = gl.createBuffer()
    const uvBuffer = gl.createBuffer()
    const colorBuffer = gl.createBuffer()

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return new RenderTarget(
      frameBuffer,
      new Texture(tex, width, height),
      vertexBuffer,
      colorBuffer,
      uvBuffer
    )
  }
}
