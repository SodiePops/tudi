import * as PIXI from 'pixi.js'
import Entity from './Entity'
import * as ResourceManager from './Util/ResourceManager'
import * as AudioManager from './Util/AudioManager'
import * as Update from './Util/Update'
import ActionChannel from './Util/ActionChannel'
import * as most from 'most'

export interface SceneResources {
  images?: string[]
  sounds?: AudioManager.SoundProperties[]
}

/**
 * A Scene is the root of a hierarchy of entities.
 * It handles loading of assets and propagating of
 * events through the scene hierarchy. It could be
 * thought of as a "level".
 */
export default class Scene {
  stage: PIXI.Container
  entityCount: number
  entities: { [name: string]: Entity } = {}
  resources: SceneResources
  update$: most.Stream<number>
  actions: ActionChannel = new ActionChannel()

  constructor(resources: SceneResources, entities: Entity[]) {
    this.stage = new PIXI.Container()
    for (const entity of entities) {
      this.entities[entity.id] = entity
    }
    this.resources = resources
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
    this.update$ = Update.update$.map(evt => evt.deltaTime)
    await ResourceManager.loadResources(this.resources.images)
    await AudioManager.loadSounds(this.resources.sounds)

    for (const entity of Object.values(this.entities)) {
      entity.scene = this
      entity.setup()
    }
  }
}
