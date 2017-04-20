/**
 * Game Class.
 */
import * as PIXI from 'pixi.js'
import Scene from './Scene'

export default class Game {
  private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer
  private scene: Scene
  private lastTimestamp: number = -1
  private isPlaying: boolean = false

  constructor(width: number, height: number, scene?: Scene) {
    this.renderer = PIXI.autoDetectRenderer(width, height)
    this.scene = scene ? scene : new Scene([], [], [])
    document.body.appendChild(this.renderer.view)

    this.update = this.update.bind(this)
  }

  start(scene?: Scene): void {
    this.scene = scene || this.scene
    this.isPlaying = true
    this.update()
  }

  private update(timestamp: number = 0): void {
    if (this.isPlaying) {
      requestAnimationFrame(this.update)
    }

    let dt: number = 0
    if (this.lastTimestamp < 0) {
      this.lastTimestamp = timestamp
    } else {
      dt = timestamp - this.lastTimestamp
    }

    this.renderer.render(this.scene.stage)
    this.scene.update(dt)
  }

  stop(): void {
    this.isPlaying = false
  }
}
