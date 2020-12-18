<template>
  <audio ref="audio" :src="src" preload :autoplay="autoplay"></audio>
</template>

<script lang="ts">
import Vue from "vue"
import notification from "@/player/notification"

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
    src: "onPlaybackStateChange",
  },
  methods: {
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
    updateProgress() {
      const state = this.$store.state as State
      const { commit } = this.$store
      const audio = this.$refs.audio as HTMLAudioElement

      const progress = audio.currentTime / audio.duration || 0
      commit("progress", progress)

      if (state.player.playing) window.requestAnimationFrame(this.updateProgress)
    },
  },
})
</script>