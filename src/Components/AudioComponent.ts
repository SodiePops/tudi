import { Component } from './Component'
import * as AudioManager from '../Util/AudioManager'

/**
 * Component for working with sounds. Currently you must work with
 * the sounds directly through the [Howl API][1].
 *
 * [1]: https://github.com/goldfire/howler.js#documentation
 * @export
 * @class AudioComponent
 * @extends {Component}
 */
export class AudioComponent extends Component {
  name = 'audio'
  sounds: {[key: string]: Howl} = {}

  constructor (public resourceNames: string[]) {
    super()
  }

  setup (): void {
    for (const resourceName of this.resourceNames) {
      if (AudioManager.sounds[resourceName]) {
        this.sounds[resourceName] = AudioManager.sounds[resourceName]
      } else {
        throw new Error(`Audio resource ${resourceName} has not been loaded!`)
      }
    }
  }

  update (): void {/* DO NOTHING */}
}
