import { MediaImage, Track } from "./player/musicSource"
import { Preferences } from "./store/preferences"

export interface State {
  currentTrack: CurrentTrackInfo
  queued: Track[]
  queue: Track[]
  queuePrev: Track[]
  playingList: string
  player: {
    playing: boolean
    volume: number
    progress: number
    duration: number
    setPosition: number | false
  }
  preferences: Preferences
}

export interface CurrentTrackInfo {
  id: string
  title: string
  artist: string
  artwork: MediaImage[]
  stream: string
}

export type SettingsValue = number | string | boolean

export interface TextString {
  [key: string]: {
    name: string
    translateValue?(...v: any): string
    desc?:
      | string
      | {
          [key: string]: string
        }
  }
}
