import * as PIXI from 'pixi.js'
import { Component } from './Component'

/**
 * @export
 * @class SpriteComponent
 * @extends {Component}
 */
export class SpriteComponent extends Component {
  name: string = 'sprite'
  sprite: PIXI.Sprite

  constructor (public spriteName: string) {
    super()
  }

  setup (): void {
    if (PIXI.loader.resources[this.spriteName]) {
      const texture: PIXI.Texture = PIXI.loader.resources[this.spriteName].texture
      this.sprite = new PIXI.Sprite(texture)
      this.entity.scene.stage.addChild(this.sprite)
    } else {
      throw new Error(`Sprite resource ${this.spriteName} has not been loaded!`)
    }
  }

  update (): void {
    // const wtArr: number[] = this.entity.transform.worldTransform.toArray()
    // wtArr[5] += dt
    // this.sprite.transform.worldTransform.fromArray(wtArr)
    // (<any>this.sprite).setTransform(...this.entity.transform.worldTransform.decompose())
    const {x, y}: {x: number, y: number} = this.entity.transform.worldPosition
    this.sprite.position.set(x, y)
    // this.sprite.transform.worldTransform.fromArray(this.entity.transform.worldTransform.toArray())
    // (<any>this.sprite.transform).worldTransform = this.entity.transform.worldTransform
    // this.sprite.position.x = 30
  }
}
