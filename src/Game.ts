/**
 * Game Class.
 */
import * as PIXI from 'pixi.js'
import Scene from './Scene'

export default class Game {
  renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer
  activeScene: Scene
  animationFrame: number

  constructor(width: number, height: number) {
    this.renderer = PIXI.autoDetectRenderer(width, height)
    document.body.appendChild(this.renderer.view)
  }

  start(scene?: Scene) {
    let s: Scene
    if (scene) {
      s = scene
    } else if (this.activeScene) {
      s = this.activeScene
    } else {
      s = new Scene()
    }

    this.activeScene = s
    this.renderer.render(s.stage)
  }

  update(tFrame: number) {
    requestAnimationFrame(this.update)

    // Do some stuff
  }

  stop() {
    cancelAnimationFrame(this.animationFrame)
  }
}
