import { Capacitor } from "@capacitor/core"
import { MediaImage } from "./musicSource"

const { isNative } = Capacitor

interface NotificationUpdate {
  title?: string
  artist?: string
  album?: string
  artwork?: MediaImage[]
  handlers?: {
    [key in MediaHandler]?: Function
  }
}

type MediaHandler =
  | "play"
  | "pause"
  | "stop"
  | "seekbackward"
  | "seekforward"
  | "seekto"
  | "previoustrack"
  | "nexttrack"

interface PositionState {
  duration: number
  playbackRate: number
  currentTime: number
}

declare global {
  interface Navigator {
    mediaSession: any
  }
  interface Window {
    MediaMetadata: any
  }
}

const notification = {
  init() {
    if (isNative) return
    // TODO@DerNuntius create proper media notification plugin for android
  },
  update({ title, artist, album, artwork, handlers = {} }: NotificationUpdate) {
    if (isNative) return
    if (!("mediaSession" in navigator)) return

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album,
      artwork,
    })

    for (const [action, handler] of Object.entries(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action, handler)
      } catch (error) {
        return "ignore"
      }
    }
  },
  setPositionState({ duration, playbackRate, currentTime: position }: PositionState) {
    if (isNative) return
    if (!("mediaSession" in navigator)) return

    navigator.mediaSession.setPositionState({
      duration,
      playbackRate,
      position,
    })
  },
}

export default notification
