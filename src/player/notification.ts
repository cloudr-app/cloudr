import { Capacitor } from "@capacitor/core"

const { isNative } = Capacitor

interface NotificationUpdate {
  title: string
  artist: string
  album: string
  artwork: string
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
    else if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title,
        artist,
        album,
        artwork: [artwork],
      })

      for (const [action, handler] of Object.entries(handlers))
        try {
          navigator.mediaSession.setActionHandler(action, handler)
        } catch (error) {
          return "ignore"
        }
    }
  },
}

export default notification
