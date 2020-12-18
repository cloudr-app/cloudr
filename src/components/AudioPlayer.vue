<template>
  <audio ref="audio" :src="src" preload></audio>
</template>

<script lang="ts">
import Vue from "vue"
// import notification from "@/player/notification"

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
      this.initMediaNotification()

      if (playing) audio.play()
      else audio.pause()
    },
  },
  methods: {
    notificationControlHandler(action: { message: string }) {
      /* eslint-disable indent */
      switch (action.message) {
        case "music-controls-pause":
          this.$store.commit("playState", false)
          break
        case "music-controls-play":
          this.$store.commit("playState", true)
          break
      }
      /* eslint-enable indent */
    },
  },
})
</script>