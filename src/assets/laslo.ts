/**
 * A container holding all loaded assets
 */
export interface Assets<Text, Json, Binary, Img, Audio> {
  text: { [name: string]: Text }
  json: { [name: string]: Json }
  binary: { [name: string]: Binary }
  image: { [name: string]: Img }
  audio: { [name: string]: Audio }
}

// TODO: Work on improving laslo to be more generic
// I just can't figure out the types right now

// export interface Loaders {
//   [key: string]: Loader<any>
// }

// export interface Loader<T> {
//   test: RegExp
//   load: (res: Response) => T
// }

// export type Blah<T extends Loaders> = {
//   [P in keyof T]: { [key: string]: T[P] }
// }

// export const laslo2 = (loaders: Loaders) => async (
//   assets: (string | AssetInfo)[]
// ) => {
//   const foo: {[key: keyof Loaders]: any} = {}

//   // Ensure that the assets passed in are all AssetInfo objects
//   const as = assets.map(a => {
//     if (typeof a === 'string') {
//       return {
//         path: a,
//         name: a,
//       }
//     } else {
//       if (!a.name) a.name = a.path
//       return a
//     }
//   })

//   for (const asset of as) {
//     for (const key in loaders) {
//       const loader = loaders[key]
//       if (loader.test.test(asset.path)) {
//         const response = await fetch(asset.path)
//         const loaded = await loader.load(response)
//         if (!foo[key]) {
//           const map: { [key: string]: typeof loaded } = {}
//           foo[key] = map
//         }
//         foo[key][asset.name] = await loader.load(response)
//         break
//       }
//     }
//   }
// }

/**
 * Information necessary to load an asset
 */
export interface AssetInfo {
  /** Path to `fetch` asset from */
  path: string
  /**
   * The type of asset. If not indicated, this
   * will be inferred from the file extension
   */
  type?: AssetType
  /**
   * The name to store the loaded asset under.
   * If not indicated, this will be set to `path`
   */
  name?: string
  /**
   * A dictionary of options to be used by custom parsers
   */
  options?: { [key: string]: any }
}

export interface LasloOptions<Text, Json, Binary, Img, Audio> {
  parsers?: {
    text?: (s: string, options?: { [key: string]: any }) => Text | Promise<Text>
    json?: (j: any, options?: { [key: string]: any }) => Json | Promise<Json>
    binary?: (
      b: Blob,
      options?: { [key: string]: any }
    ) => Binary | Promise<Binary>
    image?: (
      i: HTMLImageElement,
      options?: { [key: string]: any }
    ) => Img | Promise<Img>
    audio?: (
      a: ArrayBuffer,
      options?: { [key: string]: any }
    ) => Audio | Promise<Audio>
  }
}

export enum AssetType {
  text = 'text',
  json = 'json',
  binary = 'binary',
  image = 'image',
  audio = 'audio',
}

export const matchers = [
  { test: /\.txt$/, type: AssetType.text },
  { test: /\.json$/, type: AssetType.json },
  { test: /\.(png|jpg|jpeg)$/, type: AssetType.image },
  { test: /\.(ogg|wav|flac|mp3|m4a)$/, type: AssetType.audio },
  { test: /.*/, type: AssetType.text },
]

/**
 * A map from a AssetType to an async function that
 * loads assets of that type
 */
export const loaders = {
  text: async (path: string) => {
    const response = await fetch(path)
    return response.text()
  },

  json: async (path: string) => {
    const response = await fetch(path)
    return response.json()
  },

  binary: async (path: string) => {
    const response = await fetch(path)
    return response.blob()
  },

  image: async (path: string) => {
    return new Promise<HTMLImageElement>(resolve => {
      const img = new Image()
      img.addEventListener('load', () => resolve(img))
      img.src = path
    })
  },

  audio: async (path: string) => {
    // return new Promise<HTMLAudioElement>(resolve => {
    //   const audio = new Audio()
    //   audio.addEventListener('loadeddata', () => resolve(audio))
    //   audio.src = path
    // })
    const response = await fetch(path)
    return response.arrayBuffer()
  },
}

/**
 * Determines the AssetType of a resource
 * based on the file path
 */
export const findAssetType = (path: string): AssetType => {
  for (const matcher of matchers) {
    if (matcher.test.test(path)) {
      return matcher.type
    }
  }
  return AssetType.text
}

/**
 * Loads the given array of assets
 * 
 * @param assets An array of file paths or AssetInfo objects to be loaded
 */
export async function laslo<
  Text = string,
  Json = any,
  Binary = Blob,
  Img = HTMLImageElement,
  Audio = HTMLAudioElement
>(
  assets: (string | AssetInfo)[],
  options?: LasloOptions<Text, Json, Binary, Img, Audio>
) {
  // Ensure that the assets passed in are all AssetInfo objects
  const as = assets.map(a => {
    if (typeof a === 'string') {
      return {
        path: a,
        name: a,
        type: findAssetType(a),
      }
    } else {
      if (!a.name) a.name = a.path
      if (!a.type) a.type = findAssetType(a.path)
      return a
    }
  })

  const loaded: Assets<Text, Json, Binary, Img, Audio> = {
    text: {},
    json: {},
    binary: {},
    image: {},
    audio: {},
  }

  // Call the appropriate loader function on each asset
  for (const asset of as) {
    try {
      // TODO: This could probably be abstracted to be more DRY
      switch (asset.type) {
        case AssetType.text:
          if (options && options.parsers && options.parsers.text) {
            loaded.text[asset.name] = await options.parsers.text(
              await loaders.text(asset.path),
              asset.options
            )
          } else {
            ;(<any>loaded.text)[asset.name] = await loaders.text(asset.path)
          }
          break
        case AssetType.json:
          if (options && options.parsers && options.parsers.json) {
            loaded.json[asset.name] = await options.parsers.json(
              await loaders.json(asset.path),
              asset.options
            )
          } else {
            ;(<any>loaded.json)[asset.name] = await loaders.json(asset.path)
          }
          break
        case AssetType.binary:
          if (options && options.parsers && options.parsers.binary) {
            loaded.binary[asset.name] = await options.parsers.binary(
              await loaders.binary(asset.path),
              asset.options
            )
          } else {
            ;(<any>loaded.binary)[asset.name] = await loaders.binary(asset.path)
          }
          break
        case AssetType.image:
          if (options && options.parsers && options.parsers.image) {
            loaded.image[asset.name] = await options.parsers.image(
              await loaders.image(asset.path),
              asset.options
            )
          } else {
            ;(<any>loaded.image)[asset.name] = await loaders.image(asset.path)
          }
          break
        case AssetType.audio:
          if (options && options.parsers && options.parsers.audio) {
            loaded.audio[asset.name] = await options.parsers.audio(
              await loaders.audio(asset.path),
              asset.options
            )
          } else {
            ;(<any>loaded.audio)[asset.name] = await loaders.audio(asset.path)
          }
          break
        default:
          break
      }
    } catch (error) {
      throw new Error(
        `laslo: error loading asset '${asset.name}'
        ${error.message}`
      )
    }
  }

  return loaded
}
