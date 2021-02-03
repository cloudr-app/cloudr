import { MediaImage, Track } from "./player/musicSource"
import { Preferences } from "./store/preferences"

export interface State {
  currentTrack: PlayingTrackInfo
  nextTrack: PlayingTrackInfo
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

export interface PlayingTrackInfo {
  id: string
  title: string
  artist: string
  artwork: MediaImage[]
  stream: string
}

export type SettingsValue = number | string | boolean

type Obj = { [key: string]: any }
export interface TextString {
  [key: string]: {
    name: string
    translateValue?(...v: any): string
    desc?: string | Obj
  }
}
