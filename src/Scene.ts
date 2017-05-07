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
  entities: Entity[]
  resources: SceneResources

  constructor(resources: SceneResources, entities: Entity[]) {
    this.stage = new PIXI.Container()
    this.entities = entities
    this.resources = resources
  }

  async setup (): Promise<void> {
    await ResourceManager.loadResources(this.resources.images)
    await AudioManager.loadSounds(this.resources.sounds)

    for (const entity of this.entities) {
      entity.scene = this
      entity.setup()
    }
  }

  update (dt: number): void {
    // Call update on every entity in entities
    for (const entity of this.entities) {
      entity.update(dt)
    }
  }
}
