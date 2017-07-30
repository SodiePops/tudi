import { Vec2 } from './vec2'

/**
 * A 3x3 Matrix used for 2D transformations.
 * 
 * ┌a, c, tx┐
 * │b, d, ty│
 * └0, 0,  1┘
 * @export
 * @class Matrix
 */
export class Matrix {
  // Matrix values
  a = 1
  b = 0
  c = 0
  d = 1
  tx = 0
  ty = 0

  constructor(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty
  }

  /** Reset matrix to identity matrix values */
  identity(): Matrix {
    this.a = 1
    this.b = 0
    this.c = 0
    this.d = 1
    this.tx = 0
    this.ty = 0
    return this
  }

  /** Scale matrix in x and y directions by scalar or vector */
  scale(sx: number | Vec2, sy?: number): Matrix {
    if (sx instanceof Vec2) {
      sy = sx.y
      sx = sx.x
    } else if (sy === undefined) {
      sy = sx
    }

    this.a *= sx
    this.b *= sx
    this.c *= sy
    this.d *= sy
    return this
  }

  // TODO: Implement global engine options to use rad/deg/turn
  // turns are #1
  /** Rotate matrix by given radians */
  rotate(rad: number): Matrix {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)

    let temp = this.a * cos + this.c * sin
    this.c = this.a * -sin + this.c * cos
    this.a = temp

    temp = this.b * cos + this.d * sin
    this.d = this.b * -sin + this.d * cos
    this.b = temp

    return this
  }

  /**
   * Translates the matrix.
   * 
   * If one argument is provided, matrix will by translated by the
   * x and y values of the provided Vec2. Otherwise, arguments are
   * x and y scalar values to move matrix by.
   */
  translate(dx: number | Vec2, dy?: number): Matrix {
    if (dx instanceof Vec2) {
      dy = dx.y
      dx = dx.x
    } else if (dy === undefined) {
      dy = dx
    }

    this.tx += this.a * dx + this.c * dy
    this.ty += this.b * dx + this.d * dy

    return this
  }

  /**
   * Copies values of other matrix to this one
   */
  copy(other: Matrix): Matrix {
    this.a = other.a
    this.b = other.b
    this.c = other.c
    this.d = other.d
    this.tx = other.tx
    this.ty = other.ty
    return this
  }

  /**
   * Create new matrix with values identical to this one
   */
  clone(): Matrix {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty)
  }

  /**
   * Represent matrix as a flat array in column-major order
   */
  toArray(): number[] {
    return [this.a, this.b, 0, this.c, this.d, 0, this.tx, this.ty, 1]
  }

  /**
   * Display matrix values in formatted way
   */
  toString(): string {
    return `┌${this.a} ${this.c} ${this.tx}┐
│${this.b} ${this.d} ${this.ty}│
└0 0 1┘`
  }

  /**
   * Derives position, scale, skew, and rotation values from given matrix.
   */
  decompose(): { position: Vec2; scale: Vec2; skew: Vec2; rotation: number } {
    const transform: {
      position: Vec2
      scale: Vec2
      skew: Vec2
      rotation: number
    } = {
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
        transform.rotation += transform.rotation <= 0 ? Math.PI : -Math.PI
      }

      transform.skew.x = transform.skew.y = 0
    } else {
      transform.skew.x = skewX
      transform.skew.y = skewY
    }

    // Next set scale
    transform.scale.x = Math.sqrt(a * a + b * b)
    transform.scale.y = Math.sqrt(c * c + d * d)

    // Next set position
    transform.position.x = this.tx
    transform.position.y = this.ty

    return transform
  }

  /**
   * Multiplies given vector by this matrix to transform it
   */
  transformPoint(v: Vec2): Vec2 {
    const x: number = this.a * v.x + this.c * v.y + this.tx
    const y: number = this.b * v.x + this.d * v.y + this.ty

    return new Vec2(x, y)
  }

  /**
   * Creates a new matrix that is the
   * mathematical inverse of this one
   */
  inverse(): Matrix {
    const det = this.a * this.d - this.b * this.c

    if (det === 0) {
      return this.clone()
    }

    return new Matrix(
      this.d / det, // a
      -this.b / det, // b
      -this.c / det, // c
      this.a / det, // d
      (this.c * this.ty - this.d * this.tx) / det, // tx
      -(this.a * this.ty - this.b * this.tx) / det // ty
    )
  }

  /**
   * Set matrix values
   */
  reset(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ): Matrix {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty

    return this
  }

  /**
   * Multiply this matrix by another
   */
  multiply(m: Matrix): Matrix {
    const a: number = this.a * m.a + this.c * m.b
    const b: number = this.b * m.a + this.d * m.b

    const c: number = this.a * m.c + this.c * m.d
    const d: number = this.b * m.c + this.d * m.d

    const tx: number = this.a * m.tx + this.c * m.ty + this.tx
    const ty: number = this.b * m.tx + this.d * m.ty + this.ty

    return this.reset(a, b, c, d, tx, ty)
  }

  // ------------------------------------
  // Static methods for creating matrices
  // ------------------------------------
  static TRANSLATE({ x, y }: Vec2): Matrix {
    return new Matrix(1, 0, x, 0, 1, y)
  }

  static ROTATE(theta: number): Matrix {
    const sin: number = Math.sin(theta)
    const cos: number = Math.cos(theta)

    return new Matrix(cos, sin, 0, -sin, cos, 0)
  }

  static SCALE({ x, y }: Vec2): Matrix {
    return new Matrix(x, 0, 0, 0, y, 0)
  }

  static SKEW({ x, y }: Vec2): Matrix {
    return new Matrix(1, x, 0, y, 1, 0)
  }

  static MULTIPLY(...matrices: Matrix[]): Matrix {
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

  static IDENTITY(): Matrix {
    return new Matrix(1, 0, 0, 0, 1, 0)
  }
}
