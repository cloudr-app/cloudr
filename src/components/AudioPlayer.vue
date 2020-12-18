<template>
  <audio ref="audio" :src="src" preload :autoplay="autoplay"></audio>
</template>

<script lang="ts">
import Vue from "vue"
import notification from "@/player/notification"

function throttle(func: Function, limit: number): Function {
  let inThrottle: boolean
  return function (this: any): any {
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
  },
  methods: {
    setPosition() {
      const audio = this.$refs.audio as HTMLAudioElement
      const state = this.$store.state as State
      audio.currentTime = state.player.setPosition * audio.duration
    },
    onPlaybackStateChange() {
      const state = this.$store.state as State
      const { playing } = state.player
      const audio = this.$refs.audio as HTMLAudioElement

      if (this.lastPlaybackState === playing) return
      this.lastPlaybackState = playing

      if (playing) {
        this.autoplay = true
        audio.play()
        this.updateProgress()
      } else {
        this.autoplay = false
        audio.pause()
      }
    },
    initAudioEl() {
      const audio = this.$refs.audio as HTMLAudioElement
      const { commit } = this.$store

      audio.onplay = () => commit("playState", true)
      audio.onpause = () => commit("playState", false)
    },
    updateDuration: throttle(function () {
      const { commit } = this.$store
      const state = this.$store.state as State
      const audio = this.$refs.audio as HTMLAudioElement

      if (!isNaN(audio.duration) && state.player.duration !== audio.duration)
        commit("duration", audio.duration)
    }, 100),
    updateProgress() {
      const state = this.$store.state as State
      const { commit } = this.$store
      const audio = this.$refs.audio as HTMLAudioElement

      this.updateDuration()

      try {
        const progress = audio.currentTime / audio.duration || 0
        commit("progress", progress)
      } catch (err) {
        return "ignore"
      }

      if (state.player.playing) window.requestAnimationFrame(this.updateProgress)
    },
  },
})
</script>