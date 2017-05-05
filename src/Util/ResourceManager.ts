import * as PIXI from 'pixi.js'

/**
 *
 */
export function loadResources (resources: string[]): Promise<{}> {
  return new Promise((resolve: () => void): void => {
    PIXI.loader.add(resources).load(resolve)
  })
}

export const foo = 4
// "mp3", "opus", "ogg", "wav", "aac", "m4a", "mp4", "webm"
