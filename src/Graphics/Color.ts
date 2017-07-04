export default class Color {
  r: number = 0
  g: number = 0
  b: number = 0
  a: number = 1

  get rgba(): number[] {
    return [this.r, this.g, this.b, this.a]
  }

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  set(r: number, g: number, b: number, a: number): Color {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    return this
  }

  copy(color: Color): Color {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a
    return this
  }

  lerp(a: Color, b: Color, p: number): Color {
    this.r = a.r + (b.r - a.r) * p
    this.g = a.g + (b.g - a.g) * p
    this.b = a.b + (b.b - a.b) * p
    this.a = a.a + (b.a - a.a) * p
    return this
  }

  clone(): Color {
    return new Color().copy(this)
  }

  mult(alpha: number): Color {
    return this.set(this.r, this.g, this.b, this.a * alpha)
  }

  static white = new Color(1, 1, 1, 1)
  static black = new Color(0, 0, 0, 1)
  static red = new Color(1, 0, 0, 1)
  static green = new Color(0, 1, 0, 1)
  static blue = new Color(0, 0, 1, 1)
  static temp = new Color()
}
