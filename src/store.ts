import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentTrack: {
      id: "sc:504843810",
      title: "",
      author: "",
      artwork: "/artwork-placeholder.svg",
    },
    queue: ["sc:504843810", "sc:811306516", "sc:98893536"],
    fromList: "sc:1162452736",
    player: {
      playing: false,
      volume: 1,
    },
  },
  mutations: {
    trackInfo(state, info = {}) {
      state.currentTrack = {
        id: state.currentTrack.id,
        ...info,
      }
    },
  },
  actions: {},
  modules: {},
})
