/**
 * Represents a point in 2D space
 * @class Vec2
 */
export default class Vec2 {
  x: number
  y: number

  constructor (x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  equals (other: Vec2): boolean {
    return (this.x === other.x) && (this.y === other.y)
  }

  clone (): Vec2 {
    return new Vec2(this.x, this.y)
  }

  copy (other: Vec2): void {
    this.x = other.x
    this.y = other.y
  }
}
