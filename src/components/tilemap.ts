// import * as tmx from 'tmx-parser'
const tmx = require('tmx-parser')

import { Component } from './component'
import { Shader } from '../graphics/shader'
import { Shaders } from '../graphics/shaders'
import { RenderInstructionType, RenderInstruction } from '../graphics'
import { Texture } from '../graphics/texture'
import { Rectangle } from '../util/rectangle'
import { Game } from '../game'
import { Vec2 } from '../math'

export class Tilemap extends Component {
  name = 'tilemap'
  shader: Shader
  visible: boolean = true
  map: any
  texture: Texture
  crop: Rectangle = new Rectangle()

  rows: number
  cols: number

  wrapX: boolean
  wrapY: boolean

  private dataAssetName: string
  private textureAssetName: string

  constructor(
    dataAssetName: string,
    textureAssetName: string,
    wrapX: boolean = false,
    wrapY: boolean = false
  ) {
    super()
    this.dataAssetName = dataAssetName
    this.textureAssetName = textureAssetName
    // TODO: Make wrapping work
    this.wrapX = wrapX
    this.wrapY = wrapY
  }

  setup(): void {
    this.shader = Shaders.texture

    if (Game.assets.image[this.textureAssetName]) {
      this.texture = Game.assets.image[this.textureAssetName]
    } else {
      throw new Error(
        `Texture resource ${this.textureAssetName} has not been loaded!`
      )
    }

    if (Game.assets.text[this.dataAssetName]) {
      tmx.parse(
        Game.assets.text[this.dataAssetName],
        this.dataAssetName,
        (err: Error, map: any) => {
          if (err) {
            throw err
          }
          this.map = map

          this.cols =
            (this.texture.width + map.tileSets[0].spacing) /
            (map.tileWidth + map.tileSets[0].spacing)
          this.rows =
            (this.texture.height + map.tileSets[0].spacing) /
            (map.tileHeight + map.tileSets[0].spacing)
        }
      )
    } else {
      throw new Error(
        `Text resource ${this.dataAssetName} has not been loaded!`
      )
    }

    this.entity.update$.observe(this.update.bind(this))
    this.entity.destroy$.observe(this.destroy.bind(this))
  }

  update(): void {
    if (!this.visible || !this.map) {
      return
    }

    const tileset = this.map.tileSets[0]

    for (const camera of this.entity.scene.cameras) {
      const extents = camera.extents
      const pos = this.entity.transform.position

      const left = Math.floor((extents.left - pos.x) / this.map.tileWidth) - 1
      const right = Math.ceil((extents.right - pos.x) / this.map.tileWidth) + 1
      const top = Math.floor((extents.top - pos.y) / this.map.tileHeight) - 1
      const bottom =
        Math.ceil((extents.bottom - pos.y) / this.map.tileHeight) + 1

      this.crop.width = this.map.tileWidth
      this.crop.height = this.map.tileHeight

      for (const layer of this.map.layers) {
        for (let wy = top; wy < bottom; wy++) {
          let y = wy
          if ((wy < 0 || wy >= this.map.height) && !this.wrapY) {
            continue
          }

          if (wy < 0) {
            y = this.map.height - -wy % this.map.height
          } else if (wy >= this.map.height) {
            y = wy % this.map.height
          }

          for (let wx = left; wx < right; wx++) {
            let x = wx
            if ((wx < 0 || wx >= this.map.width) && !this.wrapX) {
              continue
            }

            if (wx < 0) {
              x = this.map.width - -wx % this.map.width
            } else if (wx >= this.map.width) {
              x = wx % this.map.width
            }

            const index = x + y * this.map.width
            const tile = layer.tileAt(x, y)
            if (tile) {
              this.crop.x =
                tile.id % this.cols * (tileset.tileWidth + tileset.spacing)
              this.crop.y =
                Math.floor(tile.id / this.cols) *
                (tileset.tileHeight + tileset.spacing)

              const ri: RenderInstruction = {
                type: RenderInstructionType.TEXTURE,
                tex: this.texture,
                mat: this.entity.transform.worldTransform,
                origin: new Vec2(-x, -y),
                crop: this.crop.clone(),
                flipX:
                  layer.horizontalFlips[index] || layer.diagonalFlips[index],
                flipY: layer.verticalFlips[index] || layer.diagonalFlips[index],
              }
              this.shader.renderQueue.push(ri)
            }
          }
        }
      }
    }
  }

  destroy(): void {
    // this.entity.scene.stage.removeChild(this.sprite)
  }
}
