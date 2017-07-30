import { Game } from './Game'
import Entity from './Entity'
import ActionChannel from './Util/ActionChannel'
import { Camera } from './Components/camera'
import * as most from 'most'

/**
 * A Scene is the root of a hierarchy of entities.
 * It handles loading of assets and propagating of
 * events through the scene hierarchy. It could be
 * thought of as a "level".
 */
export default class Scene {
  mainCamera: Camera = null
  cameras: Camera[] = []
  entityCount: number
  entities: { [name: string]: Entity } = {}
  update$: most.Stream<number>
  actions: ActionChannel = new ActionChannel()
  constructor(entities: Entity[]) {
    for (const entity of entities) {
      this.entities[entity.id] = entity
    }
  }

  addEntity(e: Entity): void {
    this.entities[e.id] = e
    e.scene = this
    e.setup()
  }

  removeEntity(id: string): Entity | void {
    if (this.entities[id]) {
      this.entityCount--
      const entity = this.entities[id]
      delete this.entities[id]
      return entity
    }
  }

  async setup(): Promise<void> {
    this.update$ = Game.update$.map(dt => {
      // Tell each camera to draw
      for (const camera of this.cameras) {
        camera.draw()
      }
      // Clear each shader's render queue
      for (const shader of Game.shaders) {
        shader.renderQueue = []
      }
      return dt
    })

    for (const entity of Object.values(this.entities)) {
      entity.scene = this
      entity.setup()
    }
  }

  async destroy() {
    this.update$ = null
  }
}
