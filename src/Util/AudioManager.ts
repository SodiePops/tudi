import { Howl } from 'howler'

export type SoundProperties = IHowlProperties | string[] | string
export const sounds: { [key: string]: Howl } = {}

export async function loadSounds(resources: SoundProperties[]): Promise<void> {
  await Promise.all(
    resources.map(resource => {
      if (typeof resource === 'object') {
        if (Array.isArray(resource)) {
          return loadSound({ src: resource })
        } else {
          return loadSound(resource)
        }
      } else {
        return loadSound({ src: [resource] })
      }
    })
  )
}

function loadSound(props: IHowlProperties): Promise<{}> {
  return new Promise(resolve => {
    const sound = new Howl(props)
    sound.once('load', resolve)
    sounds[props.src[0]] = sound
  })
}
