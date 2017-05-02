import { Component } from './Component'
import { Vec2, Matrix } from '../Math'

/**
 * Representing a set of 2D transformations using a matrix
 * @export
 * @class Transform
 */
export class Transform extends Component {
  // NOTE: A few potential optimizations could be made here
  // - Cache values of rotation matrix because sin/cos is expensive
  // - Cache values of _every_ matrix because why not
  name: string = 'transform'
  worldTransform: Matrix = Matrix.IDENTITY() // Transformation matrix relative to world
  localTransform: Matrix = Matrix.IDENTITY() // Transformation matrix relative to parent

  private isDirty: boolean = true

  private pposition: Vec2 = new Vec2(0, 0)
  private sscale: Vec2 = new Vec2(1, 1)
  private rrotation: number = 0
  // TO DO: Implement these. The math for them is confusing
  private sskew: Vec2 = new Vec2(0, 0)
  private ppivot: Vec2 = new Vec2(0, 0)

  constructor ({ position, scale, rotation, skew, pivot }: TransformInitalizer) {
    super()
    this.pposition = position || new Vec2(0, 0)
    this.sscale = scale || new Vec2(1, 1)
    this.rrotation = rotation || 0
    this.sskew = skew || new Vec2(0, 0)
    this.ppivot = pivot || new Vec2(0, 0)
  }

  private updateLocalTransform (): void {
    const lt: Matrix = this.localTransform
    const cx: number = Math.cos(this.rrotation + this.sskew.y)
    const sx: number = Math.sin(this.rrotation + this.sskew.y)
    const cy: number = -Math.sin(this.rrotation - this.sskew.x)
    const sy: number = Math.cos(this.rrotation - this.sskew.x)

    lt.a = cx * this.sscale.x
    lt.b = sx * this.sscale.x
    lt.c = cy * this.sscale.y
    lt.d = sy * this.sscale.y

    lt.tx = this.pposition.x - ((this.ppivot.x * lt.a) + (this.ppivot.y * lt.c))
    lt.ty = this.pposition.y - ((this.ppivot.x * lt.b) + (this.ppivot.y * lt.d))
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

  //------------
  // ACCESSORS |
  //------------
  get worldPosition (): Vec2 { return new Vec2(this.worldTransform.tx, this.worldTransform.ty) }
  get position (): Vec2 { return this.pposition }
  set position (p: Vec2) {
    this.isDirty = true
    this.pposition = p
  }

  get scale (): Vec2 { return this.sscale }
  set scale (s: Vec2) {
    this.isDirty = true
    this.sscale = s
  }

  get rotation (): number { return this.rrotation }
  set rotation (r: number) {
    this.isDirty = true
    this.rrotation = r
  }
}

export interface TransformInitalizer {
  position?: Vec2,
  scale?: Vec2,
  rotation?: number,
  skew?: Vec2,
  pivot?: Vec2,
}
