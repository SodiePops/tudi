import * as most from 'most'

import { Scene } from './scene'
import * as Update from './util/update'
import { Audio } from './audio'
import { Graphics } from './graphics'
import { Shaders } from './graphics/shaders'
import { Shader } from './graphics/shader'
import { Texture } from './graphics/texture'
import { Sound } from './assets/sound'
import { Vec2 } from './math'
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
  audio: Audio
  assets: Assets<string, any, Blob, Texture, Sound> = {
    text: {},
    json: {},
    binary: {},
    image: {},
    audio: {},
  }
  config: GameConfig
  shaders: Shader[] = []
  update$: most.Stream<number>
  private scene: Scene
  private isPlaying = false

  async start(
    width: number,
    height: number,
    config: GameConfig = {},
    targetId?: string,
    scene?: Scene
  ): Promise<void> {
    this.scene = scene
    this.root = targetId ? document.getElementById(targetId) : document.body
    this.config = config
    this.graphics = new Graphics()
    this.graphics.load()
    this.audio = new Audio()
    this.resize(width, height)
    Shaders.init()
    this.shaders = [Shaders.primitive, Shaders.solid, Shaders.texture]

    this.isPlaying = true
    await this.setup()
  }

  async goto(scene: Scene) {
    if (this.scene) {
      this.scene.destroy()
    }

    this.scene = scene
    await this.scene.setup()
  }

  async loadAssets(assets: (string | AssetInfo)[]) {
    const opts = {
      parsers: {
        image: Texture.create,
        audio: this.audio.createSoundFromBuffer,
      },
    }
    const loaded = await laslo(assets, opts)

    this.assets.text = { ...this.assets.text, ...loaded.text }
    this.assets.json = { ...this.assets.json, ...loaded.json }
    this.assets.binary = { ...this.assets.binary, ...loaded.binary }
    this.assets.image = { ...this.assets.image, ...loaded.image }
    this.assets.audio = { ...this.assets.audio, ...loaded.audio }
  }

  private async setup(): Promise<void> {
    this.update$ = Update.update$.map(evt => evt.deltaTime)
    this.update$.observe(() => {
      this.graphics.update()
      this.graphics.finalize()
      this.graphics.reset()
    })

    if (this.scene) {
      await this.scene.setup()
    }

    return
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.graphics.resize()
  }
}

export interface GameConfig {
  textures?: {
    origin?: Vec2
  }
}

export { Game as __Game }
// Expose Game as a singleton
const g = new Game()
export { g as Game }
