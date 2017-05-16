import * as PIXI from 'pixi.js'

/**
 *
 */
// tslint:disable-next-line
export function loadResources (resources: string[]): Promise<{}> {
  return new Promise((resolve: () => void): void => {
    PIXI.loader.add(resources).load(resolve)
  })
}
