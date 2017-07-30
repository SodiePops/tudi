import { Component } from './Component'
import { Sound } from '../assets/sound'
import { Game } from '../Game'

/**
 * Component for working with sounds
 */
export class AudioComponent extends Component {
  name = 'audio'
  sounds: { [key: string]: Sound } = {}
  resourceNames: string[]

  constructor(resourceNames: string[]) {
    super()
    this.resourceNames = resourceNames
  }

  setup(): void {
    for (const resourceName of this.resourceNames) {
      if (Game.assets.audio[resourceName]) {
        this.sounds[resourceName] = Game.assets.audio[resourceName]
      } else {
        throw new Error(`Audio resource ${resourceName} has not been loaded!`)
      }
    }
  }
}
