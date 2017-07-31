import { Sound } from '../assets/sound'

export class Audio {
  context: AudioContext

  constructor() {
    this.context = new AudioContext()
  }

  createSoundFromBuffer = async (
    buffer: ArrayBuffer
    /* opts?: { [key: string]: any } */
  ) => {
    const audioBuffer = await this.context.decodeAudioData(buffer)
    return new Sound(audioBuffer)
  }
}
