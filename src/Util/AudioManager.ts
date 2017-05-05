import { Howler, Howl } from 'howler'

/**
 *
 */
type SoundProperties = IHowlProperties & { name: string }
type SP = SoundProperties | string[] | string
export const sounds: {[key: string]: Howl} = {}

export function loadSounds (resources: SP[]): Promise<{}> {
  for (const sp of resources) {
    if (typeof sp === 'object') {
      if (Array.isArray(sp)) {
        sp
      }
    } else {
      sp
    }
  }
  return new Promise((resolve: () => void): void => {
    PIXI.loader.add(resources).load(resolve)
  })
}

