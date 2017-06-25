import * as Matter from 'matter-js'
import { Component } from './Component'

export type BodyType
  = { shape: 'circle', radius: number }
  | { shape: 'rect', width: number, height: number }

/**
 * @export
 * @class SpriteComponent
 * @extends {Component}
 */
export class PhysicsBody extends Component {
  name = 'physics'
  body: Matter.Body

  constructor (public bodyType: BodyType) {
    super()
    // this.body = Matter.Bodies.
  }

  setup (): void {
    const t = this.entity.transform.worldTransform.decompose()
    switch (this.bodyType.shape) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(
          t.position.x, t.position.y,
          this.bodyType.width, this.bodyType.height
        )
        break
      case 'circle':
        this.body = Matter.Bodies.circle(
          t.position.x, t.position.y,
          this.bodyType.radius,
        )
        break
    }

    Matter.World.add(
      this.entity.scene.physicsEngine.world,
      this.body,
    )

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update (): void {
    const t = this.entity.transform.worldTransform.decompose()

    // this.sprite.setTransform(t.position.x, t.position.y, t.scale.x, t.scale.y, t.rotation, t.skew.x, t.skew.y)
  }

  destroy (): void {
    Matter.World.remove(
      this.entity.scene.physicsEngine.world,
      this.body,
    )
  }
}
