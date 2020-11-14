export type Platform = "spotify" | "soundcloud" | "tidal" | "youtube"
export type ShortPlatform = "sp" | "sc" | "td" | "yt"
export type PlatformAccessor = Platform | ShortPlatform

export const platformShorts = {
  sc: "soundcloud",
  sp: "spotify",
  td: "tidal",
  yt: "youtube",
}
