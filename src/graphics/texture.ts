import { Game } from '../game'
import { Rectangle } from '../util/rectangle'
import { Vec2 } from '../math'

/**
 * A texture object used for WebGL rendering.
 */
export class Texture {
  /** The actual WebGL Texture object */
  webGLTexture: WebGLTexture
  /** The path to the image the Texture was created from  */
  path: string
  /** The cropped bounds of the texture */
  bounds: Rectangle
  disposed: boolean = false
  center: Vec2
  metadata: { [path: string]: any } = {}
  image?: HTMLImageElement

  texWidth: number
  texHeight: number
  get width(): number {
    return this.bounds.width
  }
  get height(): number {
    return this.bounds.height
  }

  constructor(
    tex: WebGLTexture | null,
    w: number,
    h: number,
    bounds?: Rectangle
  ) {
    this.webGLTexture = tex
    this.texWidth = w
    this.texHeight = h
    this.bounds = bounds || new Rectangle(0, 0, this.texWidth, this.texHeight)
    this.center = new Vec2(this.bounds.width / 2, this.bounds.height / 2)
  }

  getSubtexture(clip: Rectangle, sub?: Texture): Texture {
    if (sub) {
      sub.webGLTexture = this.webGLTexture
    } else {
      sub = new Texture(this.webGLTexture, this.width, this.height)
    }

    sub.bounds = clip.crop(this.bounds.clone())
    sub.center = new Vec2(sub.bounds.width / 2, sub.bounds.height / 2)
    sub.texWidth = this.texWidth
    sub.texHeight = this.texHeight
    return sub
  }

  clone(): Texture {
    return new Texture(
      this.webGLTexture,
      this.texWidth,
      this.texHeight,
      this.bounds.clone()
    )
  }

  toString(): string {
    return `${this.path}:
      bounds ${this.bounds.toString()}`
  }

  dispose() {
    if (!this.disposed) {
      const gl = Game.graphics.gl
      gl.deleteTexture(this.webGLTexture)
      this.path = ''
      this.webGLTexture = null
      this.disposed = true
    }
  }

  /** Creates a texture from an HTMLImageElement */
  static create(image: HTMLImageElement): Texture {
    const gl = Game.graphics.gl
    const tex = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)

    const newTex = new Texture(tex, image.width, image.height)
    newTex.image = image
    return newTex
  }

  /** Creates a texture from an array of pixel data */
  static createFromData(
    data: number[],
    width: number,
    height: number
  ): Texture {
    const gl = Game.graphics.gl
    const tex = gl.createTexture()

    const input = data.map(n => Math.floor(n * 255))

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(input)
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    return new Texture(tex, width, height)
  }
}
