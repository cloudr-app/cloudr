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

export default Vue.extend({
  render(h) {
    const { autoplay, src } = this
    return h("audio", {
      attrs: { preload: true, autoplay, src },
      ref: "audio",
    })
  },
  data: () => ({
    autoplay: false,
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
    const audio = this.$refs.audio as HTMLAudioElement

    audio.volume = state.player.volume
    notification.init()
    this.initAudioEl()
    this.onPlaybackStateChange()
  },
  watch: {
    "$store.state.player.playing": "onPlaybackStateChange",
    "$store.state.player.setPosition": "setPosition",
    src: "onPlaybackStateChange",
    "$store.state.preferences.defaultVolume": "setVolume",
  },
  methods: {
    setVolume: throttle(function t() {
      const audio = this.$refs.audio as HTMLAudioElement
      const state = this.$store.state as State
      audio.volume = state.preferences.defaultVolume
    }, 1e3 / 30),
    setPosition() {
      const audio = this.$refs.audio as HTMLAudioElement
      const state = this.$store.state as State
      const { commit } = this.$store

      if (state.player.setPosition === false) return

      const currentTime = state.player.setPosition * audio.duration

      if (!isNaN(currentTime)) audio.currentTime = currentTime
      else {
        audio.oncanplay = () => {
          audio.oncanplay = null
          if (state.player.setPosition === false) return
          audio.currentTime = state.player.setPosition * audio.duration
        }
      }

      commit("setPlayer", ["setPosition", false])
      this.updateProgress(true)
    },
    async onPlaybackStateChange() {
      const state = this.$store.state as State
      const { playing } = state.player
      const audio = this.$refs.audio as HTMLAudioElement

      this.setVolume()

      if (this.lastPlaybackState === playing) return
      this.lastPlaybackState = playing

      this.updateNotificationPositionState()

      if (playing) {
        this.autoplay = true
        await audio.play()
        this.updateProgress()
      } else {
        this.autoplay = false
        audio.pause()
      }
    },
    initAudioEl() {
      const audio = this.$refs.audio as HTMLAudioElement
      const { commit } = this.$store

      audio.onplay = () => commit("setPlayer", ["playing", true])
      audio.onpause = () => commit("setPlayer", ["playing", false])
      audio.onended = this.onended
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
      const audio = this.$refs.audio as HTMLAudioElement

      if (!isNaN(audio.duration) && state.player.duration !== audio.duration)
        commit("setPlayer", ["duration", audio.duration])
    }, 100),
    updateNotificationPositionState: throttle(function t() {
      const audio = this.$refs.audio as HTMLAudioElement
      const { duration, playbackRate, currentTime } = audio
      const isAnyNaN = (numbers: number[]) =>
        Boolean(numbers.filter(n => isNaN(n)).length)

      if (!isAnyNaN([duration, playbackRate, currentTime]))
        notification.setPositionState({ duration, playbackRate, currentTime })
    }, 500),
    updateProgress(single: boolean) {
      const state = this.$store.state as State
      const { commit } = this.$store
      const audio = this.$refs.audio as HTMLAudioElement

      this.updateDuration()

      try {
        const progress = audio.currentTime / audio.duration || 0
        commit("setPlayer", ["progress", progress])
      } catch (err) {
        return "ignore"
      }

      if (state.player.playing && !single)
        window.requestAnimationFrame(() => this.updateProgress())
    },
  },
})
