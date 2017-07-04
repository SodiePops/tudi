/**
 * Represents a point in 2D space
 * @class Vec2
 */
export class Vec2 {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  set(x: number, y: number): Vec2 {
    this.x = x
    this.y = y
    return this
  }

  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  copy(other: Vec2): void {
    this.x = other.x
    this.y = other.y
  }

  toString(): string {
    return `<${this.x}, ${this.y}>`
  }

  add(other: Vec2): Vec2 {
    this.x += other.x
    this.y += other.y
    return this
  }

  sub(other: Vec2): Vec2 {
    this.x -= other.x
    this.y -= other.y
    return this
  }

  mult(n: number): Vec2 {
    this.x *= n
    this.y *= n
    return this
  }

  vecMult(other: Vec2): Vec2 {
    this.x *= other.x
    this.y *= other.y
    return this
  }

  div(n: number): Vec2 {
    this.x /= n
    this.y /= n
    return this
  }

  vecDiv(other: Vec2): Vec2 {
    this.x /= other.x
    this.y /= other.y
    return this
  }

  rotate(sin: number, cos: number): Vec2 {
    const x = this.x
    const y = this.y

    this.x = x * cos - y * sin
    this.y = x * sin + y * cos
    return this
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y
  }

  static ADD(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x + v2.x, v1.y + v2.y)
  }

  static SUB(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x - v2.x, v1.y - v2.y)
  }

  static MULT(v: Vec2, n: number): Vec2 {
    return new Vec2(v.x * n, v.y * n)
  }

  static DIV(v: Vec2, n: number): Vec2 {
    return new Vec2(v.x / n, v.y / n)
  }

  static DOT(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y
  }

  static MAG(v: Vec2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  static MAGSQ(v: Vec2): number {
    return v.x * v.x + v.y * v.y
  }
}
