import { Component } from './Component'
import { Vec2, Matrix } from '../Math'

/**
 * Representing a set of 2D transformations using a matrix
 * @export
 * @class Transform
 */
export class Transform extends Component {
  // NOTE: A potential optimization could be made here
  // - Cache values of rotation matrix because sin/cos is expensive
  name = 'transform'
  worldTransform: Matrix = Matrix.IDENTITY() // Transformation matrix relative to world
  localTransform: Matrix = Matrix.IDENTITY() // Transformation matrix relative to parent

  position: Vec2 = new Vec2(0, 0)
  scale: Vec2 = new Vec2(1, 1)
  rotation = 0
  skew: Vec2 = new Vec2(0, 0)
  pivot: Vec2 = new Vec2(0, 0)

  constructor ({ position, scale, rotation, skew, pivot }: TransformInitalizer) {
    super()
    this.position = position || new Vec2(0, 0)
    this.scale = scale || new Vec2(1, 1)
    this.rotation = rotation || 0
    this.skew = skew || new Vec2(0, 0)
    this.pivot = pivot || new Vec2(0, 0)
  }

  private updateLocalTransform (): void {
    const lt: Matrix = this.localTransform
    const cx: number = Math.cos(this.rotation + this.skew.y)
    const sx: number = Math.sin(this.rotation + this.skew.y)
    const cy: number = -Math.sin(this.rotation - this.skew.x)
    const sy: number = Math.cos(this.rotation - this.skew.x)

    lt.a = cx * this.scale.x
    lt.b = sx * this.scale.x
    lt.c = cy * this.scale.y
    lt.d = sy * this.scale.y

    lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c))
    lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d))
  }

  updateTransform (parentTransform?: Transform): void {
    this.updateLocalTransform()

    if (!parentTransform) {
      this.worldTransform = this.localTransform
    } else {
      const lt: Matrix = this.localTransform
      const wt: Matrix = this.worldTransform
      const pt: Matrix = parentTransform.worldTransform

      wt.a = (lt.a * pt.a) + (lt.b * pt.c)
      wt.b = (lt.a * pt.b) + (lt.b * pt.d)
      wt.c = (lt.c * pt.a) + (lt.d * pt.c)
      wt.d = (lt.c * pt.b) + (lt.d * pt.d)
      wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx
      wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty
    }
  }

  setup (): void {
    const pt: Transform = this.entity.parent && this.entity.parent.transform
    this.updateTransform(pt)
  }

  update (): void {
    const pt: Transform = this.entity.parent && this.entity.parent.transform
    this.updateTransform(pt)
  }
}

export interface TransformInitalizer {
  position?: Vec2,
  scale?: Vec2,
  rotation?: number,
  skew?: Vec2,
  pivot?: Vec2,
}
