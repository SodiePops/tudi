import Vec2 from './Vec2'
import Matrix from './Matrix'

/**
 * Representing a set of 2D transformations using a matrix
 * @export
 * @class Transform
 */
export class Transform {
  // NOTE: A few potential optimizations could be made here
  // - Cache values of rotation matrix because sin/cos is expensive
  // - Cache values of _every_ matrix because
  worldTransform: Matrix
  localTransform: Matrix

  position: Vec2 = new Vec2(0, 0)
  scale: Vec2 = new Vec2(1, 1)
  // skew: Vec2 = new Vec2(0, 0)
  // pivot: Vec2 = new Vec2(0, 0)
  rotation: number = 0

  // constructor () {
  // }

  // get position(): Vec2 {
  //   return new Vec2(0, 0)
  // }

  updateLocalTransform (): void {
    this.localTransform = Matrix.MULTIPLY(
      Matrix.TRANSLATE(this.position),
      Matrix.ROTATE(this.rotation),
      Matrix.SCALE(this.scale),
    )
  }

  updateTransform (parentTransform: Transform): void {
    this.updateLocalTransform()

    const lt: Matrix = this.localTransform
    const pt: Matrix = parentTransform.worldTransform

    this.worldTransform = Matrix.MULTIPLY(lt, pt)
  }
}
