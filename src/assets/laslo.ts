/**
 * A container holding all loaded assets
 */
export interface Assets {
  text: { [name: string]: string }
  json: { [name: string]: any }
  binary: { [name: string]: Blob }
  image: { [name: string]: HTMLImageElement }
  audio: { [name: string]: HTMLAudioElement }
}

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
export const loaders: { [key: string]: (path: string) => Promise<any> } = {
  [AssetType.text]: async path => {
    const response = await fetch(path)
    return response.text()
  },

  [AssetType.json]: async path => {
    const response = await fetch(path)
    return response.json()
  },

  [AssetType.binary]: async path => {
    const response = await fetch(path)
    return response.blob()
  },

  [AssetType.image]: async path => {
    const img = new Image()
    const response = await fetch(path)
    const blob = await response.blob()
    img.src = URL.createObjectURL(blob)
    return img
  },

  [AssetType.audio]: async path => {
    const audio = new Audio()
    const response = await fetch(path)
    const blob = await response.blob()
    audio.src = URL.createObjectURL(blob)
    return audio
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
export async function laslo(assets: (string | AssetInfo)[]) {
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

  const loaded: Assets = {
    text: {},
    json: {},
    binary: {},
    image: {},
    audio: {},
  }

  // Call the appropriate loader function on each asset
  for (const asset of as) {
    const load = loaders[asset.type]
    if (load) {
      try {
        ;(loaded as any)[asset.type][asset.name] = await load(asset.path)
      } catch (error) {
        throw new Error(
          `aslo: error loading asset '${asset.name}'
          ${error.message}`
        )
      }
    }
  }

  return loaded
}
