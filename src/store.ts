import Vue from "vue"
import Vuex from "vuex"
import player from "@/player"
import { PlatformAccessor } from "@/utils"
import { Track } from "./player/musicSource"
import notification from "@/player/notification"

Vue.use(Vuex)

interface CurrentTrackInfo {
  id: string
  title: string
  artist: string
  artwork: string
  stream: string
}

declare global {
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
      setPosition: number
    }
  }
}

interface ActionArg {
  state: State
  commit: Function
  dispatch: Function
  [key: string]: any
}

const defaultState: State = {
  currentTrack: {
    id: "",
    title: "",
    artist: "",
    artwork: "/artwork-placeholder.svg",
    stream: "",
  },
  queuePrev: [],
  queued: [],
  queue: [],
  playingList: "",
  player: {
    playing: false,
    volume: 1,
    progress: 0,
    duration: 0,
    setPosition: 0,
  },
}

// queuePrev are the tracks that have already been played.
// queued is the list of tracks the user added to the queue.
// queue is the tracks playing from the current playlist.

const store = new Vuex.Store({
  state: defaultState,
  mutations: {
    trackStream(state: State, stream: string) {
      state.currentTrack.stream = stream
    },
    setPlayer(state: any, [prop, value]) {
      state.player[prop] = value
    },
    setQueue(state: State, queue) {
      state.queue = queue
    },
    setQueuePrev(state: State, queuePrev) {
      state.queuePrev = queuePrev
    },
    setPlayingList(state: State, playingList) {
      state.playingList = playingList
    },
  },
  actions: {
    async addQueued({ dispatch, state }: ActionArg, track: string) {
      const trackInfo = await dispatch("resolveTrackInfo", track)
      state.queued.push(trackInfo)
    },
    async currentTrack({ dispatch, state }: ActionArg, info: CurrentTrackInfo) {
      state.currentTrack = { ...state.currentTrack, ...info }
      await dispatch("updateNotification")
    },
    async updateNotification({ state, dispatch, commit }: ActionArg) {
      const { title, artist, artwork } = state.currentTrack

      const seeker = (skipBy: number) => () => {
        const { duration, progress } = state.player
        const currentTime = progress * duration
        commit("setPlayer", ["setPosition", (currentTime + skipBy) / duration])
      }

      const handlers = {
        nexttrack: () => dispatch("nextTrack"),
        previoustrack: () => dispatch("prevTrack"),
        seekforward: seeker(10),
        seekbackward: seeker(-10),
        play: () => commit("setPlayer", ["playing", true]),
        pause: () => commit("setPlayer", ["playing", false]),
        seekto: (details: any) => {
          const { duration } = state.player
          commit("setPlayer", ["setPosition", details.seekTime / duration])
        },
      }

      notification.update({ title, artist, artwork, album: "cloudr.app", handlers })
    },
    async nextTrack({ state, dispatch }: ActionArg) {
      const currentTrack = state.queue.shift()
      if (currentTrack) state.queuePrev.push(currentTrack)

      const queued = state.queued.shift()
      if (queued) state.queue.unshift(queued)

      const nextTrack = state.queue[0]
      if (!nextTrack) return console.log("end of playlist.")

      await dispatch("playTrack", `${nextTrack.platform}:${nextTrack.id}`)
    },
    async prevTrack({ state, dispatch, commit }: ActionArg) {
      const progressSeconds = state.player.progress * state.player.duration
      if (progressSeconds > 3) return commit("setPlayer", ["setPosition", 0])

      const queuePrevLastIndex = state.queuePrev.length - 1
      const previousTrack = state.queuePrev[queuePrevLastIndex]

      if (!previousTrack) return

      state.queuePrev = state.queuePrev.slice(0, queuePrevLastIndex)
      state.queue.unshift(previousTrack)

      await dispatch("playTrack", `${previousTrack.platform}:${previousTrack.id}`)
    },
    async playTrack({ dispatch, commit, state }: ActionArg, track) {
      const [platform, id] = track.split(":") as [PlatformAccessor, string]

      if (state.currentTrack.id === track) return commit("setPlayer", ["setPosition", 0])
      console.log(state.currentTrack.id, track)

      dispatch("currentTrack", { id: track })
      commit("trackStream", await player(platform).stream(Number(id)))

      const { artwork, title, user } = await dispatch("resolveTrackInfo", track)
      dispatch("currentTrack", {
        artwork,
        title,
        artist: user.username,
      })
    },
    async resolveTrackInfo(_, track: string) {
      const [platform, id] = track.split(":") as [PlatformAccessor, string]

      return await player(platform).track(Number(id))
    },
  },
})

export default store
