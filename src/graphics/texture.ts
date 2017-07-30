import { Game } from '../game'
import { Rectangle } from '../util/rectangle'
import { Vec2 } from '../math'

export class Texture {
  /** The actual WebGL Texture object */
  webGLTexture: WebGLTexture
  /** The path to the image the Texture was created from  */
  path: string
  bounds: Rectangle
  frame: Rectangle
  disposed: boolean = false
  center: Vec2
  metadata: { [path: string]: any } = {}
  image?: HTMLImageElement

  texWidth: number
  texHeight: number
  get width(): number {
    return this.frame.width
  }
  get height(): number {
    return this.frame.height
  }
  get clippedWidth(): number {
    return this.bounds.width
  }
  get clippedHeight(): number {
    return this.bounds.height
  }

  constructor(
    tex: WebGLTexture | null,
    w: number,
    h: number,
    bounds?: Rectangle,
    frame?: Rectangle
  ) {
    this.webGLTexture = tex
    this.texWidth = w
    this.texHeight = h
    this.bounds = bounds || new Rectangle(0, 0, this.texWidth, this.texHeight)
    this.frame =
      frame || new Rectangle(0, 0, this.bounds.width, this.bounds.height)
    this.center = new Vec2(this.frame.width / 2, this.frame.height / 2)
  }

  getSubtexture(clip: Rectangle, sub?: Texture): Texture {
    if (sub) {
      sub.webGLTexture = this.webGLTexture
    } else {
      sub = new Texture(this.webGLTexture, this.width, this.height)
    }

    sub.bounds.x =
      this.bounds.x +
      Math.max(0, Math.min(this.bounds.width, clip.x + this.frame.x))
    sub.bounds.y =
      this.bounds.y +
      Math.max(0, Math.min(this.bounds.height, clip.y + this.frame.y))
    sub.bounds.width = Math.max(
      0,
      this.bounds.x +
        Math.min(this.bounds.width, clip.x + this.frame.x + clip.width) -
        sub.bounds.x
    )
    sub.bounds.height = Math.max(
      0,
      this.bounds.y +
        Math.min(this.bounds.height, clip.y + this.frame.y + clip.height) -
        sub.bounds.y
    )

    sub.frame.x = Math.min(0, this.frame.x + clip.x)
    sub.frame.y = Math.min(0, this.frame.y + clip.y)
    sub.frame.width = clip.width
    sub.frame.height = clip.height
    sub.center = new Vec2(sub.frame.width / 2, sub.frame.height / 2)

    return sub
  }

  clone(): Texture {
    return new Texture(
      this.webGLTexture,
      this.texWidth,
      this.texHeight,
      this.bounds.clone(),
      this.frame.clone()
    )
  }

  toString(): string {
    return `${this.path}:
      bounds ${this.bounds.toString()}
      frame  ${this.frame.toString()}`
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
