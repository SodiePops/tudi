import { Vec2 } from '../../src/Math/Vec2'

let v0: Vec2
let v1: Vec2
let v2: Vec2
let v3: Vec2

describe('Vec2', () => {
  beforeAll(() => {
    v0 = new Vec2()
    v1 = new Vec2(1, 2)
    v2 = new Vec2(1, 2)
    v3 = new Vec2(3, 4)
  })

  it('can make an identity vector', () => {
    expect(v0).toEqual({x: 0, y: 0})
  })

  it('can make a vector with values', () => {
    expect(v1).toEqual({x: 1, y: 2})
  })

  it('can check equality', () => {
    expect(v1.equals(v2)).toBe(true)
    expect(v1.equals(v3)).toBe(false)
  })

  it('can clone into a new vector', () => {
    const v: Vec2 = v1.clone()
    expect(v).toEqual(v1)
    expect(v).not.toBe(v1)
  })

  it('can copy another vector', () => {
    v2.copy(v3)
    expect(v2).toEqual(v3)
  })

  it('can convert to string', () => {
    expect(v1.toString()).toEqual('<1, 2>')
  })
})
