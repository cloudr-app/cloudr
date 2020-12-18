import Vue from "vue"
import Vuex from "vuex"
import player from "@/player"
import { PlatformAccessor } from "./player/platformShortNames"

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
    queue: string[]
    fromList: string
    player: {
      playing: boolean
      volume: number
      progress: number
      duration: number
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
  queue: ["sc:504843810", "sc:811306516", "sc:98893536"],
  fromList: "sc:1162452736",
  player: {
    playing: false,
    volume: 1,
    progress: 0,
    duration: 0,
  },
}

const store = new Vuex.Store({
  state: defaultState,
  mutations: {
    currentTrack(state: State, info: CurrentTrackInfo) {
      state.currentTrack = { ...state.currentTrack, ...info }
    },
    trackStream(state: State, stream: string) {
      state.currentTrack.stream = stream
    },
    playState(state: State, playState) {
      state.player.playing = playState
    },
    progress(state: State, progress) {
      state.player.progress = progress
    },
    duration(state: State, duration) {
      state.player.duration = duration
    },
  },
  actions: {
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
