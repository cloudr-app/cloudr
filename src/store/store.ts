import { createStore, Store, useStore as _useStore } from "vuex"
import player from "@/player"
import { toCloudrID, fromCloudrID, defaultImage } from "@/utils"
import notification from "@/player/notification"

import preferences from "./preferences"
import { State, PlayingTrackInfo } from "@/types"
import { Track } from "@/player/musicSource"
import { InjectionKey } from "vue"

export const key: InjectionKey<Store<State>> = Symbol()
export const useStore = () => _useStore(key)

export interface ActionArg {
  state: State
  commit: Function
  dispatch: Function
  getters: {
    fullQueue: Track[]
    [key: string]: any
  }
  [key: string]: any
}

// @ts-expect-error
const defaultState: State = {
  currentTrack: {
    id: "",
    title: "",
    artist: "",
    artwork: [defaultImage],
    stream: "",
  },
  nextTrack: {
    id: "",
    title: "",
    artist: "",
    artwork: [defaultImage],
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
    setPosition: false,
  },
}

// queuePrev are the tracks that have already been played.
// queued is the list of tracks the user added to the queue.
// queue is the tracks playing from the current playlist.

export default createStore<State>({
  state: defaultState,
  modules: { preferences },
  getters: { fullQueue: s => [...s.queued, ...s.queue] },
  mutations: {
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
    async currentTrack({ dispatch, state }: ActionArg, info: PlayingTrackInfo) {
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

      let nextTrack = state.queue[0]
      if (!nextTrack) {
        state.queue = state.queuePrev
        state.queuePrev = []
        nextTrack = state.queue[0]
      }

      await dispatch("playTrack", toCloudrID(nextTrack.platform, nextTrack.id))
    },
    async prevTrack({ state, dispatch, commit }: ActionArg) {
      const progressSeconds = state.player.progress * state.player.duration
      if (progressSeconds > 3 || !state.queuePrev.length)
        return commit("setPlayer", ["setPosition", 0])

      const queuePrevLastIndex = state.queuePrev.length - 1
      const previousTrack = state.queuePrev[queuePrevLastIndex]

      if (!previousTrack) return

      state.queuePrev = state.queuePrev.slice(0, queuePrevLastIndex)
      state.queue.unshift(previousTrack)

      await dispatch("playTrack", toCloudrID(previousTrack.platform, previousTrack.id))
    },
    async playTrack({ dispatch, commit, state }: ActionArg, track) {
      const { platform, id } = fromCloudrID(track)

      if (state.currentTrack.id === track) return commit("setPlayer", ["setPosition", 0])

      if (state.nextTrack.id !== track) {
        dispatch("currentTrack", { id: track })
        const stream = await player(platform).stream(id)
        // commit("setPlayer", ["playing", true])

        const { artwork, title, user } = await dispatch("resolveTrackInfo", track)
        dispatch("currentTrack", {
          artwork,
          title,
          artist: user.username,
          stream,
        })
      } else {
        // commit("setPlayer", ["playing", true])
        dispatch("currentTrack", { ...state.nextTrack })
      }

      dispatch("preloadNext")
    },
    async preloadNext({ state, getters }: ActionArg) {
      const { artwork, title, user, id, platform } = getters.fullQueue[1]
      const stream = await player(platform).stream(id)

      state.nextTrack = {
        artwork,
        title,
        artist: user.username,
        id: toCloudrID(platform, id),
        stream,
      }
    },
    async resolveTrackInfo(_, track: string) {
      const { platform, id } = fromCloudrID(track)

      return await player(platform).track(Number(id))
    },
  },
})
