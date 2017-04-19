/**
 * Scene Class.
 */
import * as PIXI from 'pixi.js'

export default class Scene {
  stage: PIXI.Container

  constructor() {
    this.stage = new PIXI.Container()
  }
}
