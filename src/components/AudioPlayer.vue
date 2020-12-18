<template>
  <audio ref="audio" :src="src" preload></audio>
</template>

<script lang="ts">
import Vue from "vue"
import notification from "@/player/notification"

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const audio = this.$refs.audio as HTMLAudioElement

    audio.volume = this.$store.state.player.volume
    notification.init()
    this.initAudioEl()
    this.onPlaybackStateChange(this.$store.state.player.playing)
  },
  watch: {
    "$store.state.player.playing": "onPlaybackStateChange",
  },
  methods: {
    onPlaybackStateChange(playing: boolean) {
      const audio = this.$refs.audio as HTMLAudioElement

      if (playing) audio.play()
      else audio.pause()
    },
    initAudioEl() {
      const audio = this.$refs.audio as HTMLAudioElement
      const { commit } = this.$store

      audio.onplay = () => commit("playState", true)
      audio.onpause = () => commit("playState", false)
    },
  },
})
</script>