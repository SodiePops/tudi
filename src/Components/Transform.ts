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
  // skew: Vec2 = new Vec2(0, 0)
  // pivot: Vec2 = new Vec2(0, 0)

  constructor ({ position, scale, rotation }: TransformInitalizer) {
    super()
    this.pposition = position || new Vec2(0, 0)
    this.sscale = scale || new Vec2(1, 1)
    this.rrotation = rotation || 0
  }

  private updateLocalTransform (): void {
    if (!this.isDirty) { return }

    this.localTransform = Matrix.MULTIPLY(
      Matrix.TRANSLATE(this.pposition),
      Matrix.ROTATE(this.rrotation),
      Matrix.SCALE(this.sscale),
    )
  }

  updateTransform (parentTransform?: Transform): void {
    console.log(this.entity.name, 'updateTransform')
    this.updateLocalTransform()
    // console.log(parentTransform, this)

    if (!parentTransform) {
      console.log(this.entity.name, 'worldTransform = localTransform')
      this.worldTransform = this.localTransform
    } else {
      const lt: Matrix = this.localTransform
      const pt: Matrix = parentTransform.worldTransform

      this.worldTransform = Matrix.MULTIPLY(lt, pt)
      console.log(this.entity.name, 'worldTransform is lt * pt')
      console.log(lt, pt)
    }
  }

  setup (): void {
    const pt: Transform = this.entity.parent && this.entity.parent.transform
    console.log(this.entity.name, 'transform setup', pt)
    this.updateTransform(pt)
    // console.log(this.localTransform, this.worldTransform)
  }

  update (): void {
    // const pt: Transform = this.entity.parent && this.entity.parent.transform
    // console.log(this.entity, this.entity.parent)
    // this.updateTransform(pt)
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
}
