import * as PIXI from 'pixi.js'
import Component from './Component'

/**
 * @export
 * @class SpriteComponent
 * @extends {Component}
 */
export default class SpriteComponent extends Component {
  name: string = 'sprite'
  sprite: PIXI.Sprite
  spriteName: string

  constructor (spriteName: string) {
    super()
    this.spriteName = spriteName
  }

  setup (): void {
    if (PIXI.loader.resources[this.spriteName]) {
      const texture: PIXI.Texture = PIXI.loader.resources[this.spriteName].texture
      this.sprite = new PIXI.Sprite(texture)
    } else {
      throw new Error(`Sprite resource ${this.spriteName} has not been loaded!`)
    }
  }

  update (dt: number): void {
    // TODO
  }
}
