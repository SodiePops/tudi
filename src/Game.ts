import * as PIXI from 'pixi.js'
import Scene from './Scene'
import * as Update from './Util/Update'

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
  // private lastTimestamp = -1
  private isPlaying = false

  constructor (width: number, height: number, scene?: Scene) {
    this.renderer = PIXI.autoDetectRenderer(width, height)
    this.scene = scene ? scene : new Scene([], [])
    document.body.appendChild(this.renderer.view)
  }

  async start (scene?: Scene): Promise<void> {
    this.scene = scene || this.scene
    this.isPlaying = true
    await this.setup()
  }

  private async setup (): Promise<void> {
    await this.scene.setup()

    Update.subscribe(({ deltaTime }) => {
      this.scene.update(deltaTime)
      this.renderer.render(this.scene.stage)
    })

    return
  }

  // private update (): void {
  //   // this.scene.update(dt)
  //   this.renderer.render(this.scene.stage)
  // }
}
