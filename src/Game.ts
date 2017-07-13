// import * as PIXI from 'pixi.js'
import * as most from 'most'
import Scene from './Scene'
import * as Update from './Util/Update'
import Graphics from './Graphics'
import { Shaders } from './Graphics/shaders'
import { Shader } from './Graphics/Shader'
import { laslo, Assets, AssetInfo } from './assets/laslo'

/**
 * The Game handles operation of the entire game (duh).
 * It runs the update loop and dispatches other lifetime
 * events.
 */
class Game {
  width: number
  height: number
  root: HTMLElement
  graphics: Graphics
  assets: Assets = {
    text: {},
    json: {},
    binary: {},
    image: {},
    audio: {},
  }
  shaders: Shader[] = []
  update$: most.Stream<number>
  // private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer
  private scene: Scene
  private isPlaying = false

  async start(
    width: number,
    height: number,
    targetId?: string,
    scene?: Scene
  ): Promise<void> {
    this.scene = scene || new Scene({}, [])
    this.root = targetId ? document.getElementById(targetId) : document.body
    this.graphics = new Graphics()
    this.graphics.load()
    this.resize(width, height)
    Shaders.init()
    this.shaders = [Shaders.primitive, Shaders.solid, Shaders.texture]

    this.isPlaying = true
    await this.setup()
  }

  async loadAssets(assets: (string | AssetInfo)[]) {
    const loaded = await laslo(assets)

    this.assets.text = { ...this.assets.text, ...loaded.text }
    this.assets.json = { ...this.assets.json, ...loaded.json }
    this.assets.binary = { ...this.assets.binary, ...loaded.binary }
    this.assets.image = { ...this.assets.image, ...loaded.image }
    this.assets.audio = { ...this.assets.audio, ...loaded.audio }
  }

  private async setup(): Promise<void> {
    this.update$ = Update.update$.map(evt => {
      this.graphics.finalize()
      this.graphics.update()
      this.graphics.reset()

      return evt.deltaTime
    })

    await this.scene.setup()

    return
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.graphics.resize()
  }
}

export { Game as __Game }
// Expose Game as a singleton
const g = new Game()
export { g as Game }
