export class Sound {
  sound: HTMLAudioElement

  get playing(): boolean {
    return !this.sound.paused && this.sound.currentTime > 0 && !this.sound.ended
  }

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
  }

  play() {
    this.sound.play()
  }

  pause() {
    this.sound.pause()
  }

  stop() {
    this.sound.pause()
    this.sound.currentTime = 0
    this.sound.volume = 1
    this.sound.muted = false
  }

  static create(sound: HTMLAudioElement) {
    return new Sound(sound)
  }
}
