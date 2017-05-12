import * as PIXI from 'pixi.js'
import Entity from './Entity'
import * as ResourceManager from './Util/ResourceManager'
import * as AudioManager from './Util/AudioManager'

export interface SceneResources {
  images?: string[],
  sounds?: AudioManager.SoundProperties[],
}

/**
 * A Scene is the root of a hierarchy of entities.
 * It handles loading of assets and propagating of
 * events through the scene hierarchy. It could be
 * thought of as a "level".
 *
 * @export
 * @class Scene
 */
export default class Scene {
  stage: PIXI.Container
  entityCount: number
  entities: { [name: string]: Entity } = {}
  resources: SceneResources

  constructor(resources: SceneResources, entities: Entity[]) {
    this.stage = new PIXI.Container()
    for (const entity of entities) {
      this.entities[entity.id] = entity
    }
    this.resources = resources
  }

  addEntity (e: Entity): void {
    this.entities[e.id] = e
    e.scene = this
    e.setup()
  }

  removeEntity (id: string): Entity | void {
    if (this.entities[id]) {
      this.entityCount--
      const entity = this.entities[id]
      delete this.entities[id]
      return entity
    }
  }

  async setup (): Promise<void> {
    await ResourceManager.loadResources(this.resources.images)
    await AudioManager.loadSounds(this.resources.sounds)

    for (const entity of Object.values(this.entities)) {
      entity.scene = this
      entity.setup()
    }
  }

  update (dt: number): void {
    // Call update on every entity in entities
    for (const entity of Object.values(this.entities)) {
      entity.update(dt)
    }
  }
}
