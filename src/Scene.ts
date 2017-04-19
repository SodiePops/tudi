/**
 * Scene Class.
 */
import * as PIXI from 'pixi.js'

export default class Scene {
  stage: PIXI.Container
  // entities: Entity[]

  constructor() {
    this.stage = new PIXI.Container()
  }

  update(): void {
    // Call update on every entity in entities
  }
}
