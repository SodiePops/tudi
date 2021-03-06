/**
 * Class representing a color in rgba format. Contains
 * methods for working with colors.
 */
export class Color {
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

  /** Sets color values */
  set(r: number, g: number, b: number, a: number): this {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    return this
  }

  /** Set color values to those of given color */
  copy(color: Color): this {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a
    return this
  }

  /** Set this color to be a blend between the two given colors. */
  lerp(a: Color, b: Color, p: number): this {
    this.r = a.r + (b.r - a.r) * p
    this.g = a.g + (b.g - a.g) * p
    this.b = a.b + (b.b - a.b) * p
    this.a = a.a + (b.a - a.a) * p
    return this
  }

  /** Create a new color with identical values to this one */
  clone(): Color {
    return new Color().copy(this)
  }

  /** Multiply the alpha of this color */
  mult(alpha: number): this {
    return this.set(this.r, this.g, this.b, this.a * alpha)
  }

  // Pre-defined colors
  static white = new Color(1, 1, 1, 1)
  static black = new Color(0, 0, 0, 1)
  static red = new Color(1, 0, 0, 1)
  static green = new Color(0, 1, 0, 1)
  static blue = new Color(0, 0, 1, 1)
  static temp = new Color()
}
