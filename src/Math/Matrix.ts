/**
 * A 3x3 Matrix
 * [a, b, tx]
 * [c, d, ty]
 * [0, 0,  1]
 * @export
 * @class Matrix
 */
export default class Matrix {
  static IDENTITY: Matrix = new Matrix(1, 0, 0, 0, 1, 0)

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

  reset (a: number, b: number, tx: number,
         c: number, d: number, ty: number): Matrix {
    this.a = a
    this.b = b
    this.tx = tx
    this.c = c
    this.d = d
    this.ty = ty

    return this
  }

  scalarMultiply (n: number): Matrix {
    this.a *= n
    this.b *= n
    this.tx *= n
    this.c *= n
    this.d *= n
    this.ty *= n

    return this
  }

  multiply (m: Matrix): Matrix {
    const a: number = this.a * m.a + this.b * m.c
    const b: number = this.a * m.b + this.b * m.d
    const tx: number = this.a * m.tx + this.b * m.ty + this.tx
    const c: number = this.c * m.a + this.d * m.c
    const d: number = this.c * m.b + this.d * m.d
    const ty: number = this.c * m.tx + this.d * m.ty + this.ty

    return this.reset(a, b, tx, c, d, ty)
  }

  translate (x: number, y: number): Matrix {
    const translationMatrix: Matrix = new Matrix(0, 0, x, 0, 0, y)
    return this.multiply(translationMatrix)
  }

  scale (w: number, h: number): Matrix {
    const scaleMatrix: Matrix = new Matrix(w, 0, 0, 0, h, 0)
    return this.multiply(scaleMatrix)
  }

  rotate (theta: number): Matrix {
    const sin: number = Math.sin(theta)
    const cos: number = Math.cos(theta)

    const rotationMatrix: Matrix =
      new Matrix(cos, sin, 0, -sin, cos, 0)
    return this.multiply(rotationMatrix)
  }

  skew (x: number, y: number): Matrix {
    const skewMatrix: Matrix = new Matrix(1, x, 0, y, 1, 0)
    return this.multiply(skewMatrix)
  }

  clone (): Matrix {
    return new Matrix(this.a, this.b, this.tx, this.c, this.d, this.ty)
  }
}
