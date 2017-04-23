import * as PIXI from 'pixi.js'

/**
 *
 */
export function loadResources (resources: string[]): Promise<{}> {
  return new Promise((resolve: () => void): void => {
    PIXI.loader.add(resources).load(resolve)
  })
}

export const foo: number = 4
