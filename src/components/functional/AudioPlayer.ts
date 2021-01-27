import Vue from "vue"
import notification from "@/player/notification"

import { State } from "@/types"

function throttle(func: Function, limit: number): Function {
  let inThrottle: boolean
  return function t(this: any): any {
    const args = arguments
    const context = this
    if (!inThrottle) {
      inThrottle = true
      func.apply(context, args)
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

const playingEl = document.createElement("audio")
// @ts-expect-error
window.playingEl = playingEl

const nextEl = document.createElement("audio")
// @ts-expect-error
window.nextEl = nextEl

for (const el of [playingEl, nextEl]) {
  el.preload = "auto"
  el.autoplay = true
}

export default Vue.extend({
  render: h => h(),
  data: () => ({
    lastPlaybackState: false,
  }),
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const state = this.$store.state as State

    playingEl.volume = state.player.volume
    playingEl.src = this.src
    this.setOncanplay()
    notification.init()
    this.initAudioEl()
    this.onPlaybackStateChange()
  },
  beforeDestroy() {
    playingEl.src = ""
    playingEl.pause()
    nextEl.src = ""
    nextEl.pause()
  },
  watch: {
    "$store.state.player.playing": "onPlaybackStateChange",
    "$store.state.player.setPosition": "setPosition",
    async src(n) {
      playingEl.src = n
      this.setOncanplay()
      this.onPlaybackStateChange()
    },
    "$store.state.preferences.defaultVolume": "setVolume",
  },
  methods: {
    setVolume: throttle(function t() {
      const state = this.$store.state as State
      playingEl.volume = state.preferences.defaultVolume
    }, 1e3 / 30),
    setOncanplay() {
      const state = this.$store.state as State
      const { commit } = this.$store

      playingEl.oncanplaythrough = () => {
        playingEl.oncanplaythrough = null
        if (state.player.setPosition === false) return

        const currentTime = state.player.setPosition * playingEl.duration
        if (!isNaN(currentTime)) playingEl.currentTime = currentTime

        commit("setPlayer", ["setPosition", false])
      }
    },
    setPosition() {
      const state = this.$store.state as State
      const { commit } = this.$store

      if (state.player.setPosition === false) return

      const currentTime = state.player.setPosition * playingEl.duration

      if (!isNaN(currentTime)) {
        playingEl.currentTime = currentTime
        commit("setPlayer", ["setPosition", false])
      }

      this.updateProgress(true)
    },
    async onPlaybackStateChange() {
      const state = this.$store.state as State
      const { playing } = state.player

      this.setVolume()

      if (this.lastPlaybackState === playing) return
      this.lastPlaybackState = playing

      this.updateNotificationPositionState()

      if (playing) {
        playingEl.autoplay = true
        await playingEl.play()
        this.updateProgress()
      } else {
        playingEl.autoplay = false
        playingEl.pause()
      }
    },
    initAudioEl() {
      const { commit, state } = this.$store

      playingEl.onplay = () => commit("setPlayer", ["playing", true])
      playingEl.onpause = () => {
        if (state.player.progress < 0.999) commit("setPlayer", ["playing", false])
      }
      playingEl.onended = this.onended
    },
    async onended() {
      // TODO implement repeating tracks
      const { commit } = this.$store

      await this.$store.dispatch("nextTrack")
      commit("setPlayer", ["playing", true])
    },
    updateDuration: throttle(function t() {
      const { commit } = this.$store
      const state = this.$store.state as State

      if (!isNaN(playingEl.duration) && state.player.duration !== playingEl.duration)
        commit("setPlayer", ["duration", playingEl.duration])
    }, 100),
    updateNotificationPositionState: throttle(function t() {
      const { duration, playbackRate, currentTime } = playingEl
      const isAnyNaN = (numbers: number[]) =>
        Boolean(numbers.filter(n => isNaN(n)).length)

      if (!isAnyNaN([duration, playbackRate, currentTime]))
        notification.setPositionState({ duration, playbackRate, currentTime })
    }, 500),
    updateProgress(single: boolean) {
      const state = this.$store.state as State
      const { commit } = this.$store

      this.updateDuration()

      try {
        const progress = playingEl.currentTime / playingEl.duration || 0
        commit("setPlayer", ["progress", progress])
      } catch (err) {
        return "ignore"
      }

      if (state.player.playing && !single)
        window.requestAnimationFrame(() => this.updateProgress())
    },
  },
})
