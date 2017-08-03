/**
 * Represents a point in 2D space. Has both functional
 * and object-oriented APIs for manipulating vectors.
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

  /** Compares the x and y values of two vectors */
  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y
  }

  /** Create a new Vec2 with the same values as this one */
  clone(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  /** Copy the values of the other vector into this one */
  copy(other: Vec2): void {
    this.x = other.x
    this.y = other.y
  }

  /** Displays vector values in a formatted way */
  toString(): string {
    return `<${this.x}, ${this.y}>`
  }

  /** Rounds the x and y values to integers */
  round(): this {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }

  static round(v: Vec2): Vec2 {
    return new Vec2(Math.round(v.x), Math.round(v.y))
  }

  /** Vector addition */
  add(other: Vec2): Vec2 {
    this.x += other.x
    this.y += other.y
    return this
  }

  static add(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x + v2.x, v1.y + v2.y)
  }

  /** Vector subtraction */
  sub(other: Vec2): Vec2 {
    this.x -= other.x
    this.y -= other.y
    return this
  }

  static sub(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x - v2.x, v1.y - v2.y)
  }

  /** Multiply each component by a scalar factor `n` */
  scale(n: number): Vec2 {
    this.x *= n
    this.y *= n
    return this
  }

  static scale(v: Vec2, n: number): Vec2 {
    return new Vec2(v.x * n, v.y * n)
  }

  /** Component-wise multiplication (Hadamard product) */
  mult(other: Vec2): Vec2 {
    this.x *= other.x
    this.y *= other.y
    return this
  }

  static mult(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x * v2.x, v1.y * v2.y)
  }

  /** Component-wise division */
  div(other: Vec2): Vec2 {
    this.x /= other.x
    this.y /= other.y
    return this
  }

  static div(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x / v2.x, v1.y / v2.x)
  }

  /**
   * Rotate the angle. If one value is given, it is the radian amount
   * to rotate by. If two values are given, they are assumed to be
   * pre-computed sine and cosine values to rotate by.
   */
  rotate(rad: number, cos?: number): Vec2 {
    if (cos === undefined) {
      cos = Math.cos(rad)
      rad = Math.sin(rad)
    }

    const x = this.x
    const y = this.y

    this.x = x * cos - y * rad
    this.y = x * rad + y * cos
    return this
  }

  static rotate(v: Vec2, rad: number): Vec2 {
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)

    const x = v.x * cos - v.y * sin
    const y = v.x * sin + v.y * cos

    return new Vec2(x, y)
  }

  /** Scalar (dot) product */
  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y
  }

  static dot(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y
  }

  /** Get the magnitude (length) of the vector */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  static mag(v: Vec2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  /** Get the magnitude-squared of the vector */
  magSq(): number {
    return this.x * this.x + this.y * this.y
  }

  static magsq(v: Vec2): number {
    return v.x * v.x + v.y * v.y
  }

  /** Make a vector in the same direction with a magnitude of 1 */
  normal(): Vec2 {
    const mag = this.mag()
    this.x /= mag
    this.y /= mag
    return this
  }

  static normal(v: Vec2): Vec2 {
    const mag = Vec2.mag(v)
    return new Vec2(v.x / mag, v.y / mag)
  }

  /** Get the angle (in radians) between the x-axis and this vector */
  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  static angle(v: Vec2): number {
    return Math.atan2(v.x, v.y)
  }
}
