interface State {
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
}

interface CurrentTrackInfo {
  id: string
  title: string
  artist: string
  artwork: MediaImage[]
  stream: string
}

type SettingsValue = number | string | boolean

interface TextString {
  [key: string]: {
    name: string
    desc:
      | string
      | {
          [key: string]: string
        }
  }
}
