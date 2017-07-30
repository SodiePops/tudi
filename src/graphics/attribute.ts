/**
 * Data object for a WebGL shader attribute
 */
export class Attribute {
  name: string
  type: AttributeType
  attribute: number

  constructor(name: string, type: AttributeType) {
    this.name = name
    this.type = type
  }
}

/**
 * Enum of WebGL shader attribute types
 */
export enum AttributeType {
  Position = 'position',
  Texcoord = 'texcoord',
  Color = 'color',
}
