import { Component } from './Component'
import { Shader } from '../Graphics/Shader'
import { Shaders } from '../Graphics/shaders'
import { RenderInstructionType } from '../Graphics'
// import { Game } from '../Game'
import Color from '../Graphics/Color'

export class OutlineComponent extends Component {
  name = 'outline'
  shader: Shader
  visible: boolean = true
  color: Color

  constructor(color: Color = Color.green) {
    super()
    this.color = color
  }

  setup(): void {
    this.shader = Shaders.primitive

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update(): void {
    const pos = this.entity.transform.position
    // TODO: Don't mutate renderQueue directly
    if (this.visible) {
      this.shader.renderQueue.push({
        type: RenderInstructionType.HOLLOWRECT,
        x: pos.x,
        y: pos.y,
        width: 10,
        height: 10,
        stroke: 2,
        color: this.color,
      })
    }
  }

  destroy(): void {
    // this.entity.scene.stage.removeChild(this.sprite)
  }
}
