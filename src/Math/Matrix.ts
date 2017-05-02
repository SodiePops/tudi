import { Vec2 } from './Vec2'

/**
 * A 3x3 Matrix
 * ┌a, b, tx┐
 * │c, d, ty│
 * └0, 0,  1┘
 * @export
 * @class Matrix
 */
export class Matrix {
  a: number = 1
  b: number = 0
  tx: number = 0
  c: number = 0
  d: number = 1
  ty: number = 0

  constructor (a: number, b: number, tx: number,
               c: number, d: number, ty: number) {
    this.a = a
    this.b = b
    this.tx = tx
    this.c = c
    this.d = d
    this.ty = ty
  }

  clone (): Matrix {
    return new Matrix(this.a, this.b, this.tx, this.c, this.d, this.ty)
  }

  toArray (): number[] {
    return [this.a, this.b, this.tx, this.c, this.d, this.ty]
  }

  toString (): string {
    return `┌${this.a} ${this.b} ${this.tx}┐
│${this.c} ${this.d} ${this.ty}│
└0 0 1┘`
  }

  decompose (): {position: Vec2, scale: Vec2, skew: Vec2, rotation: number} {
    const transform: {position: Vec2, scale: Vec2, skew: Vec2, rotation: number} = {
      position: new Vec2(0, 0),
      scale: new Vec2(0, 0),
      skew: new Vec2(0, 0),
      rotation: 0,
    }

    const a: number = this.a
    const b: number = this.b
    const c: number = this.c
    const d: number = this.d

    const skewX: number = -Math.atan2(-c, d)
    const skewY: number = Math.atan2(b, a)

    const delta: number = Math.abs(skewX + skewY)

    if (delta < 0.00001) {
        transform.rotation = skewY

        if (a < 0 && d >= 0) {
            transform.rotation += (transform.rotation <= 0) ? Math.PI : -Math.PI
        }

        transform.skew.x = transform.skew.y = 0
    } else {
        transform.skew.x = skewX
        transform.skew.y = skewY
    }

    // next set scale
    transform.scale.x = Math.sqrt((a * a) + (b * b))
    transform.scale.y = Math.sqrt((c * c) + (d * d))

    // next set position
    transform.position.x = this.tx
    transform.position.y = this.ty

    return transform
  }

  transformPoint (v: Vec2): Vec2 {
    const x: number = this.a * v.x + this.b * v.y + this.tx
    const y: number = this.c * v.x + this.d * v.y + this.ty

    return new Vec2(x, y)
  }

  // -----------------------
  // Private mutator methods
  // -----------------------
  private reset (a: number, b: number, tx: number,
         c: number, d: number, ty: number): Matrix {
    this.a = a
    this.b = b
    this.tx = tx
    this.c = c
    this.d = d
    this.ty = ty

    return this
  }

  private multiply (m: Matrix): Matrix {
    const a: number = m.a * this.a + m.b * this.c
    const b: number = m.a * this.b + m.b * this.d
    const tx: number = m.a * this.tx + m.b * this.ty + m.tx
    const c: number = m.c * this.a + m.d * this.c
    const d: number = m.c * this.b + m.d * this.d
    const ty: number = m.c * this.tx + m.d * this.ty + m.ty

    return this.reset(a, b, tx, c, d, ty)
  }

  // ------------------------------------
  // Static methods for creating matrices
  // ------------------------------------
  static TRANSLATE ({x, y}: Vec2): Matrix {
    return new Matrix(1, 0, x, 0, 1, y)
  }

  static ROTATE (theta: number): Matrix {
    const sin: number = Math.sin(theta)
    const cos: number = Math.cos(theta)

    return new Matrix(cos, sin, 0, -sin, cos, 0)
  }

  static SCALE ({x, y}: Vec2): Matrix {
    return new Matrix(x, 0, 0, 0, y, 0)
  }

  static SKEW ({x, y}: Vec2): Matrix {
    return new Matrix(1, x, 0, y, 1, 0)
  }

  static MULTIPLY (...matrices: Matrix[]): Matrix {
    if (matrices.length > 1) {
      const n: Matrix = new Matrix(1, 0, 0, 0, 1, 0)
      for (const m of matrices) {
        n.multiply(m)
      }
      return n
    } else if (matrices.length === 1) {
      return matrices[0]
    } else {
      return Matrix.IDENTITY()
    }
  }

  static IDENTITY (): Matrix {
    return new Matrix(1, 0, 0, 0, 1, 0)
  }
}
