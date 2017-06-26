import { Matrix, Vec2 } from '../../src/Math'

let m0: Matrix

describe('Matrix', () => {
  beforeEach(() => {
    m0 = new Matrix(1, 2, 3, 4, 5, 6)
  })

  it('can create a matrix', () => {
    expect(m0).toEqual({a: 1, b: 2, tx: 3, c: 4, d: 5, ty: 6})
  })

  it('can clone itself', () => {
    const m: Matrix = m0.clone()
    expect(m).toEqual(m0)
    expect(m).not.toBe(m0)
  })

  it('can convert to array', () => {
    expect(m0.toArray()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('can decompose into component values', () => {
    const m: Matrix = Matrix.MULTIPLY(
      Matrix.SCALE(new Vec2(3, 4)),
      Matrix.ROTATE(Math.PI / 2),
      Matrix.TRANSLATE(new Vec2(5, 6)),
    )
    const comp: any = m.decompose()
    expect(comp.position).toEqual(new Vec2(5, 6))
    expect(comp.scale).toEqual(new Vec2(4, 3))
    expect(comp.skew).toEqual(new Vec2(0, 0))
    expect(comp.rotation).toBeCloseTo(Math.PI / 2, 5)
  })

  it('can transform a point', () => {
    const m: Matrix = Matrix.MULTIPLY(
      Matrix.SCALE(new Vec2(3, 4)),
      Matrix.ROTATE(Math.PI / 2),
      Matrix.TRANSLATE(new Vec2(5, 6)),
    )
    const p: Vec2 = m.transformPoint(new Vec2(1, 1))
    expect(p.x).toBeCloseTo(9, 5)
    expect(p.y).toBeCloseTo(3, 5)
  })

  // ----------------------------
  // Matrix constructor functions
  // ----------------------------
  it('can create an identity matrix', () => {
    expect(Matrix.IDENTITY())
      .toEqual({a: 1, b: 0, tx: 0, c: 0, d: 1, ty: 0})
  })

  it('can create a translation matrix', () => {
    expect(Matrix.TRANSLATE(new Vec2(1, 2)))
      .toEqual({a: 1, b: 0, tx: 1, c: 0, d: 1, ty: 2})
  })

  it('can create a rotate matrix', () => {
    const m: Matrix = Matrix.ROTATE(Math.PI / 2)
    expect(m.a).toBeCloseTo(0, 5)
    expect(m.b).toBeCloseTo(1, 5)
    expect(m.tx).toBeCloseTo(0, 5)
    expect(m.c).toBeCloseTo(-1, 5)
    expect(m.d).toBeCloseTo(0, 5)
    expect(m.ty).toBeCloseTo(0, 5)
  })

  it('can create a scale matrix', () => {
    expect(Matrix.SCALE(new Vec2(3, 4)))
      .toEqual({a: 3, b: 0, tx: 0, c: 0, d: 4, ty: 0})
  })

  it('can create a skew matrix', () => {
    expect(Matrix.SKEW(new Vec2(3, 4)))
      .toEqual({a: 1, b: 3, tx: 0, c: 4, d: 1, ty: 0})
  })

  // ---------------------
  // Matrix multiplication
  // ---------------------
  it('can multiply a single matrix', () => {
    const m: Matrix = Matrix.MULTIPLY(
      Matrix.IDENTITY(),
    )
    expect(m).toEqual({a: 1, b: 0, tx: 0, c: 0, d: 1, ty: 0})
  })

  it('can multiply two matrices', () => {
    const m: Matrix = Matrix.MULTIPLY(
      Matrix.TRANSLATE(new Vec2(3, 4)),
      Matrix.SCALE(new Vec2(5, 6)),
    )
    expect(m).toEqual({a: 5, b: 0, tx: 15, c: 0, d: 6, ty: 24})
  })

  it('can multiply three matrices', () => {
    const m: Matrix = Matrix.MULTIPLY(
      Matrix.TRANSLATE(new Vec2(3, 4)),
      Matrix.SCALE(new Vec2(5, 6)),
      Matrix.TRANSLATE(new Vec2(8, 9)),
    )
    expect(m).toEqual({a: 5, b: 0, tx: 23, c: 0, d: 6, ty: 33})
  })
})
