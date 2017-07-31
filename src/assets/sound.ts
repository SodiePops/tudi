import { Game } from '../game'

export class Sound {
  private context: AudioContext = Game.audio.context
  private gainNode: GainNode
  private buffer: AudioBuffer

  private source: AudioBufferSourceNode = null

  get playing(): boolean {
    return !!this.source
  }

  private _playbackRate: number = 1.0

  get playbackRate(): number {
    return this._playbackRate
  }
  set playbackRate(n: number) {
    this._playbackRate = n
    if (this.source) {
      this.source.playbackRate.value = n
    }
  }

  get volume(): number {
    return this.gainNode.gain.value
  }

  set volume(n: number) {
    this.gainNode.gain.value = Math.min(1.0, Math.max(0.0, n))
  }

  constructor(buffer: AudioBuffer) {
    this.buffer = buffer
    this.gainNode = this.context.createGain()
    this.gainNode.connect(this.context.destination)
  }

  play() {
    const source = this.context.createBufferSource()
    source.buffer = this.buffer
    source.playbackRate.value = this._playbackRate
    source.onended = () => {
      if (this.source === source) {
        this.source = null
      }
    }
    source.connect(this.gainNode)
    source.start()
    this.source = source
  }

  // pause() {
  //   // this.sound.pause()
  // }

  // stop() {
  //   this.source.stop()
  //   this.playing = false
  // }
}
