<template>
  <audio ref="audio" :src="src" preload></audio>
</template>

<script lang="ts">
import Vue from "vue"

import { Plugins } from "@capacitor/core"
const { CapacitorMusicControls } = Plugins

const once = (fn: Function) => {
  let called = !1
  return function (...args: any[]) {
    if (!called) return (called = !0), fn.apply(this, args)
  }
}

const createMusicControls = once((info: any) => {
  CapacitorMusicControls.create(
    {
      /* eslint-disable no-inline-comments */
      track: info.title,
      artist: info.author,
      album: "",
      cover: info.artwork,

      hasPrev: false,
      hasNext: false,
      hasClose: false,

      // iOS only, optional
      duration: 60, // optional, default: 0
      elapsed: 10, // optional, default: 0
      hasSkipForward: true, // optional, default: false. true value overrides hasNext.
      hasSkipBackward: true, // optional, default: false. true value overrides hasPrev.
      skipForwardInterval: 15, // optional. default: 15.
      skipBackwardInterval: 15, // optional. default: 15.
      hasScrubbing: false, // optional. default to false. Enable scrubbing from control center progress bar

      // Android only, optional
      isPlaying: true, // optional, default : true
      dismissable: false, // optional, default : false
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker: `cloudr playing ${info.author} - ${info.title}`,
      // All icons default to their built-in android equivalents
      // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: "media_play",
      pauseIcon: "media_pause",
      prevIcon: "media_prev",
      nextIcon: "media_next",
      closeIcon: "media_close",
      notificationIcon: "notification",
    },
    console.log,
    console.log
  )
})

const addMusicControlListeners = once((callback: Function) => {
  CapacitorMusicControls.addListener("controlsNotification", callback)
})

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

      CapacitorMusicControls.updateIsPlaying({
        isPlaying: playing,
      })
    },
  },
  methods: {
    initMediaNotification() {
      const { title, author, artwork } = this.$store.state.currentTrack
      createMusicControls({ title, author, artwork })
      addMusicControlListeners(this.notificationControlHandler)
    },
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
  beforeDestroy() {
    CapacitorMusicControls.destroy()
  },
})
</script>