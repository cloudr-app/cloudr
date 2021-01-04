export const touchEventOffset = (event: any, target?: any) => {
  target = target || event.currentTarget

  const cx = event.clientX || 0
  const cy = event.clientY || 0
  const rect = target.getBoundingClientRect()

  return [cx - rect.left, cy - rect.top]
}

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

type CloudrID = string

/**
 * convert a given platform and an ID to the cloudrID format
 * @param platform the platform identifier, can be both long or short
 * @param id number
 * @example toCloudrID("soundcloud", 16514846) // "sc:16514846"
 */
export const toCloudrID = (platform: Platform, id: number): CloudrID =>
  `${platformsLong[platform] || platform}:${id}`

/**
 * convert the cloudrID format to an array containing the platform and id
 * @param cloudrID
 * @example fromCloudrID("soundcloud:16514846") // ["sc", "16514846"]
 */
export const fromCloudrID = (cloudrID: CloudrID): [PlatformAccessor, number] => {
  const [platform, id] = cloudrID.split(":") as [Platform, number]
  const pl = (platformsLong[platform] || platform) as PlatformAccessor
  return [pl, id]
}
