import { Component } from './Component'
import { Shader } from '../Graphics/Shader'
import { Shaders } from '../Graphics/shaders'
// import Texture from '../Graphics/Texture'
import { RenderInstructionType } from '../Graphics'

export class SpriteComponent extends Component {
  name = 'sprite'
  sprite: PIXI.Sprite
  spriteName: string
  shader: Shader = Shaders.texture

  constructor(spriteName: string) {
    super()
    this.spriteName = spriteName
  }

  setup(): void {
    if (PIXI.loader.resources[this.spriteName]) {
      const texture: PIXI.Texture =
        PIXI.loader.resources[this.spriteName].texture
      this.sprite = new PIXI.Sprite(texture)
      const t = this.entity.transform.worldTransform.decompose()
      this.sprite.setTransform(
        t.position.x,
        t.position.y,
        t.scale.x,
        t.scale.y,
        t.rotation,
        t.skew.x,
        t.skew.y
      )
      // this.entity.scene.stage.addChild(this.sprite)
    } else {
      throw new Error(`Sprite resource ${this.spriteName} has not been loaded!`)
    }

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update(): void {
    // TODO: Don't mutate renderQueue directly
    this.shader.renderQueue.push({
      type: RenderInstructionType.TEXTURE,
      tex: null,
      posX: 0,
      posY: 0,
      crop: null,
      color: null,
      origin: null,
      scale: null,
      rotation: 0,
      flipX: false,
      flipY: false,
    })

    const t = this.entity.transform.worldTransform.decompose()
    this.sprite.setTransform(
      t.position.x,
      t.position.y,
      t.scale.x,
      t.scale.y,
      t.rotation,
      t.skew.x,
      t.skew.y
    )
  }

  destroy(): void {
    // this.entity.scene.stage.removeChild(this.sprite)
  }
}
