import * as PIXI from 'pixi.js'
import Scene from './Scene'

/**
 * The Game handles operation of the entire game (duh).
 * It runs the update loop and dispatches other lifetime
 * events.
 *
 * @export
 * @class Game
 */
export default class Game {
  private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer
  private scene: Scene
  private lastTimestamp = -1
  private isPlaying = false

  constructor (width: number, height: number, scene?: Scene) {
    this.renderer = PIXI.autoDetectRenderer(width, height)
    this.scene = scene ? scene : new Scene([], [])
    document.body.appendChild(this.renderer.view)

    this.update = this.update.bind(this)
  }

  start (scene?: Scene): Promise<void> {
    this.scene = scene || this.scene
    this.isPlaying = true
    return this.setup()
  }

  private setup (): Promise<void> {
    return this.scene.setup()
      .then(() => this.update())
  }

  private update (timestamp: number = 0): void {
    if (this.isPlaying) {
      requestAnimationFrame(this.update)
    }

    let dt = 0
    if (this.lastTimestamp < 0) {
      this.lastTimestamp = timestamp
    } else {
      dt = timestamp - this.lastTimestamp
    }

    this.scene.update(dt)
    this.renderer.render(this.scene.stage)
  }

  stop (): void {
    this.isPlaying = false
  }
}
