import { Game } from '../Game'
import Rectangle from '../Graphics/Rectangle'
import { Matrix, Vec2 } from '../Math'
import { Component } from './Component'
import Color from '../Graphics/Color'
import RenderTarget from '../Graphics/RenderTarget'

/**
 * TODO: Document this
 */
export class Camera extends Component {
  name = 'camera'

  // TODO: Replace this with Transform
  position = new Vec2()
  origin = new Vec2()
  scale = new Vec2(1, 1)
  rotation = 0

  target: RenderTarget
  clearColor: Color = new Color(0, 0, 0, 0)
  shaderUniformName: string = 'matrix'

  private _matrix = Matrix.IDENTITY()

  private get internal(): Matrix {
    return Matrix.MULTIPLY(
      Matrix.TRANSLATE(this.origin),
      Matrix.ROTATE(this.rotation),
      Matrix.SCALE(this.scale),
      Matrix.TRANSLATE(Vec2.MULT(this.position, -1))
    )
  }

  get matrix(): Matrix {
    this._matrix = Matrix.MULTIPLY(Game.graphics.orthographic, this.internal)
    return this._matrix
  }

  get mouse(): Vec2 {
    // TODO
    return new Vec2()
  }

  private extentsA = new Vec2()
  private extentsB = new Vec2()
  private extentsC = new Vec2()
  private extentsD = new Vec2()
  private extentsRect = new Rectangle()

  setup() {
    const scene = this.entity.scene
    scene.cameras.push(this)

    if (!scene.mainCamera) {
      scene.mainCamera = this
    }

    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  destroy() {
    const scene = this.entity.scene
    scene.cameras = scene.cameras.filter(c => c !== this)
    this.target = null

    if (scene.mainCamera === this) {
      scene.mainCamera = null
    }
  }

  draw() {
    if (this.target) {
      Game.graphics.setRenderTarget(this.target)
      Game.graphics.clear(this.clearColor)
    } else {
      Game.graphics.setRenderTarget(Game.graphics.buffer)
    }

    for (const shader of Game.shaders) {
      Game.graphics.shader = shader
      Game.graphics.shader.set(this.shaderUniformName, this.matrix)

      // TODO: Use camera matrix to transform draw instructions?
      for (const instruction of shader.renderQueue) {
        Game.graphics.draw(instruction)
      }
    }
  }

  private getExtents() {
    const inverse = this.internal.inverse()
    this.extentsA = inverse.transformPoint(new Vec2(0, 0))
    this.extentsB = inverse.transformPoint(new Vec2(Game.width, 0))
    this.extentsC = inverse.transformPoint(new Vec2(0, Game.height))
    this.extentsD = inverse.transformPoint(new Vec2(Game.width, Game.height))
  }

  get extents(): Rectangle {
    this.getExtents()
    const r = this.extentsRect
    r.x = Math.min(
      this.extentsA.x,
      this.extentsB.x,
      this.extentsC.x,
      this.extentsD.x
    )
    r.y = Math.min(
      this.extentsA.y,
      this.extentsB.y,
      this.extentsC.y,
      this.extentsD.y
    )
    r.width =
      Math.max(
        this.extentsA.x,
        this.extentsB.x,
        this.extentsC.x,
        this.extentsD.x
      ) - r.x
    r.height =
      Math.max(
        this.extentsA.y,
        this.extentsB.y,
        this.extentsC.y,
        this.extentsD.y
      ) - r.y
    return r
  }
}
