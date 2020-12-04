<template>
  <audio ref="audio" :src="src" preload></audio>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const { audio } = this.$refs as any

    audio.volume = this.$store.state.player.volume
  },
  watch: {
    "$store.state.player.playing"(playing) {
      const { audio } = this.$refs as any
      if (playing) audio.play()
      else audio.pause()
    },
  },
})
</script>