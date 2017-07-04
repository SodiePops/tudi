import { Game } from './Game'
import Rectangle from './Graphics/Rectangle'
import { Matrix, Vec2 } from './Math'

export class Camera {
  position = new Vec2()
  origin = new Vec2()
  scale = new Vec2(1, 1)
  rotation = 0

  private _matrix = Matrix.IDENTITY()
  private _internal = Matrix.IDENTITY()
  private _mouse = new Vec2()

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
