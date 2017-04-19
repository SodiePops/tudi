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

  start(scene?: Scene): void {
    this.activeScene = scene || this.activeScene || new Scene()
    this.update()
  }

  update(): void {
    this.renderer.render(this.activeScene.stage)
    this.activeScene.update()
    this.animationFrame = requestAnimationFrame(this.update)
  }

  stop(): void {
    cancelAnimationFrame(this.animationFrame)
  }
}
