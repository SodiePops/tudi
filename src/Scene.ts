import * as PIXI from 'pixi.js'
import System from './Systems/System'
import Entity from './Entity'

/**
 * Scene Class.
 */

export default class Scene {
  stage: PIXI.Container
  systems: System[]
  entities: Entity[]

  constructor(resources: string[], systems: System[], entities: Entity[]) {
    this.stage = new PIXI.Container()
    this.systems = systems
    this.entities = entities

    for (const resource of resources) {
      PIXI.loader.add(resource)
    }
  }

  update (dt: number): void {
    // Call update on every entity in entities
    for (const entity of this.entities) {
      entity.update(dt)
    }
  }
}
