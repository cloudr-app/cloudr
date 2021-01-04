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

export const platformShorts = {
  sc: "soundcloud",
  sp: "spotify",
  td: "tidal",
  yt: "youtube",
  soundcloud: "sc",
  spotify: "sp",
  tidal: "td",
  youtube: "yt",
}
