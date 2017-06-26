import * as PIXI from 'pixi.js'
import { Component } from './Component'

/**
 * @export
 * @class SpriteComponent
 * @extends {Component}
 */
export class SpriteComponent extends Component {
  name = 'sprite'
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
      const t = this.entity.transform.worldTransform.decompose()
      this.sprite.setTransform(t.position.x, t.position.y, t.scale.x, t.scale.y, t.rotation, t.skew.x, t.skew.y)
      this.entity.scene.stage.addChild(this.sprite)
    } else {
      throw new Error(`Sprite resource ${this.spriteName} has not been loaded!`)
    }

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update (): void {
    const t = this.entity.transform.worldTransform.decompose()
    this.sprite.setTransform(t.position.x, t.position.y, t.scale.x, t.scale.y, t.rotation, t.skew.x, t.skew.y)
  }

  destroy (): void {
    this.entity.scene.stage.removeChild(this.sprite)
  }
}
