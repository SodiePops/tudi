export default class Rectangle {
  x: number
  y: number
  width: number
  height: number

  get left(): number {
    return this.x
  }
  get right(): number {
    return this.x + this.width
  }
  get top(): number {
    return this.y
  }
  get bottom(): number {
    return this.y + this.height
  }

  constructor(x: number = 0, y: number = 0, w: number = 1, h: number = 1) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
  }

  set(x: number, y: number, w: number, h: number): Rectangle {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    return this
  }

  crop(r: Rectangle): Rectangle {
    if (r.x < this.x) {
      r.width += r.x - this.x
      r.x = this.x
    }

    if (r.y < this.y) {
      r.height += r.y - this.y
      r.y = this.y
    }

    if (r.x > this.right) {
      r.x = this.right
      r.width = 0
    }

    if (r.y > this.bottom) {
      r.y = this.bottom
      r.height = 0
    }

    if (r.right > this.right) {
      r.width = this.right - r.x
    }

    if (r.bottom > this.bottom) {
      r.height = this.bottom - r.y
    }

    return r
  }

  copy(from: Rectangle): Rectangle {
    this.x = from.x
    this.y = from.y
    this.width = from.width
    this.height = from.height
    return this
  }

  clone(): Rectangle {
    return new Rectangle().copy(this)
  }

  toString(): string {
    return `[ ${this.x}, ${this.y}, ${this.width}, ${this.height} ]`
  }
}
