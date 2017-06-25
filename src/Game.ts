import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
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
  private physicsEngine: Matter.Engine
  private scene: Scene
  private isPlaying = false

  constructor (width: number, height: number, scene?: Scene) {
    this.renderer = PIXI.autoDetectRenderer(width, height)
    this.physicsEngine = Matter.Engine.create()
    this.scene = scene ? scene : new Scene([], [])
    document.body.appendChild(this.renderer.view)
  }

  async start (scene?: Scene): Promise<void> {
    this.scene = scene || this.scene
    this.scene.physicsEngine = this.physicsEngine
    this.isPlaying = true
    await this.setup()
  }

  private async setup (): Promise<void> {
    await this.scene.setup()

    Update.subscribe(({ deltaTime }) => {
      Matter.Engine.update(this.physicsEngine, deltaTime * 1000)
      this.renderer.render(this.scene.stage)
    })

    return
  }
}
