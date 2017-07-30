export class Attribute {
  name: string
  type: AttributeType
  attribute: number

  constructor(name: string, type: AttributeType) {
    this.name = name
    this.type = type
  }
}

export enum AttributeType {
  Position = 'position',
  Texcoord = 'texcoord',
  Color = 'color',
}
