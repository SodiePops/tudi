import { Game } from '../game'
import { Rectangle } from '../util/rectangle'
import { Matrix, Vec2 } from '../math'
import { Component } from './component'
import { Color } from '../util/color'
import { Entity } from '../entity'
import { RenderTarget } from '../graphics/renderTarget'

/**
 * TODO: Document this
 */
export class Camera extends Component {
  name = 'camera'
  target: RenderTarget
  clearColor: Color = new Color(0, 0, 0, 0)
  shaderUniformName: string = 'matrix'

  private _matrix: Matrix = Matrix.IDENTITY()
  get matrix(): Matrix {
    return this._matrix
      .copy(Game.graphics.orthographic)
      .multiply(this.entity.transform.worldTransform.inverse())
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

  static createDefaultCameraEntity() {
    return new Entity('camera', {}, [new Camera()], [])
  }

  private getExtents() {
    const inverse = this.entity.transform.worldTransform
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
