import Vue from "vue"
import Vuex from "vuex"
import player from "@/player"
import { PlatformAccessor } from "./player/platformShortNames"
import { Track } from "./player/musicSource"

Vue.use(Vuex)

interface CurrentTrackInfo {
  id: string
  title?: string
  artist?: string
  artwork?: string
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
    async nextTrack({ state, dispatch }: { state: State; dispatch: Function }) {
      const currentTrack = state.queued.shift() || state.queue.shift()
      if (currentTrack) state.queuePrev.push(currentTrack)

      const nextTrack = state.queue[0]
      if (!nextTrack) return console.log("end of playlist.")

      await dispatch("playTrack", `${nextTrack.platform}:${nextTrack.id}`)
    },
    async playTrack({ dispatch, commit }, id) {
      commit("currentTrack", { id })
      dispatch("resolveTrack")
    },
    async resolveTrack({ commit, state }) {
      const [platform, id] = state.currentTrack.id.split(":") as [
        PlatformAccessor,
        string
      ]

      commit("trackStream", await player(platform).stream(id))

      const { artwork, title, user } = await player(platform).track(id)
      commit("currentTrack", {
        artwork,
        title,
        artist: user.username,
      })
    },
  },
})

export default store
