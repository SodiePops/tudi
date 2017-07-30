import { Component } from './Component'
import { Shader } from '../Graphics/Shader'
import { Shaders } from '../Graphics/shaders'
import Texture from '../Graphics/Texture'
import { RenderInstructionType } from '../Graphics'
import { Game } from '../Game'
import { Vec2 } from '../Math'

export class SpriteComponent extends Component {
  name = 'sprite'
  texture: Texture
  spriteName: string
  origin: Vec2
  shader: Shader
  visible: boolean = true

  constructor(spriteName: string, origin?: Vec2) {
    super()
    this.spriteName = spriteName
    this.origin = origin
  }

  setup(): void {
    this.shader = Shaders.texture
    if (Game.assets.image[this.spriteName]) {
      this.texture = Game.assets.image[this.spriteName]
    } else {
      throw new Error(
        `Texture resource ${this.spriteName} has not been loaded!`
      )
    }

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update(): void {
    // TODO: Don't mutate renderQueue directly
    if (this.visible) {
      this.shader.renderQueue.push({
        type: RenderInstructionType.TEXTURE,
        tex: this.texture,
        mat: this.entity.transform.worldTransform,
        origin: this.origin, // TODO: Fill in rest of these?
        crop: null,
        color: null,
        flipX: false,
        flipY: false,
      })
      ;(<any>window).t = this.entity.transform
    }
  }

  destroy(): void {
    // this.entity.scene.stage.removeChild(this.sprite)
  }
}
