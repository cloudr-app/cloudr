import Vue from "vue"
import Vuex from "vuex"
import player from "@/player"
import { PlatformAccessor } from "./player/platformShortNames"
import { Track } from "./player/musicSource"
import notification from "@/player/notification"

Vue.use(Vuex)

interface CurrentTrackInfo {
  id: string
  title: string
  artist: string
  artwork: string
  stream?: string
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

interface ActionArgs {
  state: State
  commit: Function
  dispatch: Function
  [key: string]: any
}

// queuePrev are the tracks that have already been played.
// queued is the list of tracks the user added to the queue.
// queue is the tracks playing from the current playlist.

const store = new Vuex.Store({
  state: defaultState,
  getters: {
    futureQueue: state => [...state.queued, ...state.queue],
  },
  mutations: {
    currentTrack(state: State, info: CurrentTrackInfo) {
      state.currentTrack = { ...state.currentTrack, ...info }
    },
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
    async currentTrack({ dispatch, commit }: ActionArgs, info: CurrentTrackInfo) {
      commit("currentTrack", info)
      dispatch("updateNotification")
    },
    async updateNotification({ state, dispatch, commit }: ActionArgs) {
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
    async nextTrack({ state, dispatch }: ActionArgs) {
      const currentTrack = state.queued.shift() || state.queue.shift()
      if (currentTrack) state.queuePrev.push(currentTrack)

      const nextTrack = state.queue[0]
      if (!nextTrack) return console.log("end of playlist.")

      await dispatch("playTrack", `${nextTrack.platform}:${nextTrack.id}`)
    },
    async prevTrack({ state, dispatch, commit }: ActionArgs) {
      const progressSeconds = state.player.progress * state.player.duration
      if (progressSeconds > 3) return commit("setPlayer", ["setPosition", 0])

      const queuePrevLastIndex = state.queuePrev.length - 1
      const previousTrack = state.queuePrev[queuePrevLastIndex]

      if (!previousTrack) return

      state.queuePrev = state.queuePrev.slice(0, queuePrevLastIndex)
      state.queue.unshift(previousTrack)

      await dispatch("playTrack", `${previousTrack.platform}:${previousTrack.id}`)
    },
    async playTrack({ dispatch }: ActionArgs, id) {
      dispatch("currentTrack", { id })
      dispatch("resolveTrack")
    },
    async resolveTrack({ commit, state, dispatch }: ActionArgs) {
      const [platform, id] = state.currentTrack.id.split(":") as [
        PlatformAccessor,
        string
      ]

      commit("trackStream", await player(platform).stream(id))

      const { artwork, title, user } = await player(platform).track(id)
      dispatch("currentTrack", {
        artwork,
        title,
        artist: user.username,
      })
    },
  },
})

export default store
