import ky from "ky"
import { ID, MediaImage } from "./player/musicSource"
import { preferenceLocation } from "./strings"

/**
 * util for getting the movement of touch events
 */
export const touchEventOffset = (event: any, target?: any) => {
  target = target || event.currentTarget

  const cx = event.clientX || 0
  const cy = event.clientY || 0
  const rect = target.getBoundingClientRect()

  return [cx - rect.left, cy - rect.top]
}

/**
 * Returns a player-friendly display of the time in seconds
 * @param secs seconds
 */
export const formatTime = (secs: number) => {
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor(secs / 60 - hours * 60)
  const seconds = Math.floor(secs - minutes * 60 - hours * 3600)

  const pad = (n: number) => String(n).padStart(2, "0")
  let ret = `${pad(minutes)}:${pad(seconds)}`

  if (hours) ret = `${hours}:${ret}`

  return ret
}

export type Platform = "spotify" | "soundcloud" | "tidal" | "youtube"
export type ShortPlatform = "sp" | "sc" | "td" | "yt"
export type PlatformAccessor = Platform | ShortPlatform

export const platformsShort = {
  sc: "soundcloud",
  sp: "spotify",
  td: "tidal",
  yt: "youtube",
}

export const platformsLong = {
  soundcloud: "sc",
  spotify: "sp",
  tidal: "td",
  youtube: "yt",
}

export type Type = "user" | "playlist" | "track"
export type ShortType = "u" | "pl" | "t"
export type TypeAccessor = Type | ShortType

export const typesShort = {
  u: "user",
  pl: "playlist",
  t: "track",
}

export const typesLong = {
  user: "u",
  playlist: "pl",
  track: "t",
}

type CloudrID = string

/**
 * convert a given platform and an ID to the cloudrID format
 * @param platform the platform identifier, can be both long or short
 * @param id number
 * @example toCloudrID("soundcloud", 16514846) // "sc:16514846"
 * @example toCloudrID("soundcloud", 16514846, "user") // "u:sc:16514846"
 */
export const toCloudrID = (platform: PlatformAccessor, id: ID, type: Type = "track") => {
  const _type = typesLong[type] || type
  // @ts-expect-error
  const _platform = platformsLong[platform] || platform

  return `${_type}:${_platform}:${id}` as CloudrID
}

type SplitCloudrID = [ID, Platform, Type?]
/**
 * convert the cloudrID format to an array containing the platform and id
 * @param cloudrID
 * @example fromCloudrID("soundcloud:16514846") // { platform: "sc", id: 16514846 }
 * @example fromCloudrID("user:soundcloud:16514846") // { platform: "sc", id: 16514846, type: "u" }
 */
export const fromCloudrID = (cloudrID: CloudrID) => {
  const [id, _platform, _type] = [...cloudrID.split(":")].reverse() as SplitCloudrID
  const platform = (platformsLong[_platform] || _platform) as PlatformAccessor

  let type = "t"
  if (_type) type = (typesLong[_type] || _type) as TypeAccessor

  return { platform, id, type }
}

/**
 * Slim localStorage wrapper.
 * include a value to write, exclude it to read a localStorage value.
 * stringifies and parses every input.
 * @param key
 * @param value
 */
export const ls = (key: string, value?: any) =>
  void 0 !== value
    ? localStorage.setItem(key, JSON.stringify(value))
    : JSON.parse(localStorage.getItem(key) as string)

/**
 * Returns an instance of ky with automatic cache-first cache
 * @param cacheName a name for the cache
 */
export const kyCache = (cacheName: string) => {
  if ("caches" in self) {
    return ky.extend({
      retry: 0,
      hooks: {
        beforeRequest: [
          async req => {
            if (!window[preferenceLocation].network.metadataCacheFirst) return

            const cache = await caches.open(cacheName)
            const cached = await cache.match(req)

            if (cached) {
              // refresh cache
              cache.add(req)
              return cached
            }
          },
        ],
        afterResponse: [
          async (req, _, res) => {
            try {
              const cache = await caches.open(cacheName)
              await cache.put(req, res)
            } catch (err) {
              "ignore"
            }
          },
        ],
      },
    })
  }

  return ky
}

/**
 * Returns a Function that can be used to get blobs via cacheKy a instance
 * @param cacheKy a kyCache instance
 */
export const getCacheBlob = (cacheKy: Function) => async (url: string) =>
  URL.createObjectURL(await cacheKy(url).blob())

/**
 * Converts a MediaImage sizes property to width
 * @param sizes MediaImage sizes
 */
export const getWidth = (sizes: string) => Number(sizes.split("x")[0])

/**
 * Returns an image as large or larger than specified. Falls back to the largest available.
 * @param images MediaImage array
 * @param size number
 */
export const getImageLargerThan = (images: MediaImage[], size: number) => {
  const sorted = [...images].sort((a, b) => getWidth(a.sizes) - getWidth(b.sizes))
  const largest = sorted.filter(s => getWidth(s.sizes) >= size)[0]

  if (largest) return largest
  return sorted[sorted.length - 1]
}

export const defaultImage: MediaImage = {
  src: "/artwork-placeholder.svg",
  sizes: "512x512",
  type: "image/svg+xml",
}

export interface SrcSet {
  src: string
  srcset: string
  sizes: string
}

export const srcset = (images: MediaImage[], defaultSize: number): SrcSet => {
  images = images.length ? images : [defaultImage]

  return {
    src: getImageLargerThan(images, defaultSize).src,
    srcset: images.map(image => `${image.src} ${getWidth(image.sizes)}w`).join(),
    sizes: `${defaultSize}px`,
  }
}

export const isObject = (item: any) => {
  return item && typeof item === "object" && !Array.isArray(item)
}

type Obj = { [key: string]: any }
export const updateDeep = (source: Obj, updater: Obj) => {
  const output = { ...source }
  if (!isObject(source) || !isObject(updater)) return output

  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (key in updater) output[key] = updateDeep(source[key], updater[key])
    } else if (key in updater) output[key] = updater[key]
  })

  return output
}

export type imageType = ".png" | ".jpg" | ".gif"
export const imageTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
}

// <3|❤|❤️
export const heartEmoji = ["%3C3", "%E2%9D%A4", "%E2%9D%A4%EF%B8%8F"]
