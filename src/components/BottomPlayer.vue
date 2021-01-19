<template>
  <div class="player">
    <img :src="imgSrc" alt="track art" class="artwork" />
    <div class="right">
      <div class="upper">
        <div class="track-info">
          <div class="title" :title="title">{{ title }}</div>
          <div class="artist" :title="artist">{{ artist }}</div>
        </div>
        <div class="spacer"></div>
        <div class="controls">
          <div class="skip-previous" @click="$store.dispatch('prevTrack')">
            <i class="mi">skip_previous</i>
          </div>
          <div class="play-pause" @click="playPause">
            <i v-if="$store.state.player.playing" class="mi">pause</i>
            <i v-else class="mi">play_arrow</i>
          </div>
          <div class="skip-next" @click="$store.dispatch('nextTrack')">
            <i class="mi">skip_next</i>
          </div>
        </div>
      </div>
      <div class="lower">
        <slider
          @input="sliderVal"
          :value="progress"
          :prefix="formatTime(progress * duration)"
          :postfix="formatTime(duration)"
          :update-slack="5"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { WatchHandler } from "vue"
import { mapState } from "vuex"
import { formatTime, getImageLargerThan } from "@/utils"

// eslint-disable-next-line no-unused-vars
import type { MediaImage } from "@/player/musicSource"
import Slider from "@/components/Slider.vue"

export default Vue.extend({
  components: { Slider },
  name: "bottomPlayer",
  computed: {
    ...mapState({
      progress: (state: any) => state.player.progress,
      duration: (state: any) => state.player.duration,
      title: (state: any) => state.currentTrack.title,
      artist: (state: any) => state.currentTrack.artist,
    }),
    imgSrc() {
      const images = this.$store.state.currentTrack.artwork as MediaImage[]
      if (!images.length) return

      return getImageLargerThan(images, 55).src
    },
  },
  methods: {
    formatTime,
    playPause() {
      const { commit } = this.$store
      const state = this.$store.state as State

      commit("setPlayer", ["playing", !state.player.playing])
    },
    sliderVal(pos: any) {
      const { commit } = this.$store
      commit("setPlayer", ["setPosition", pos])
    },
  },
})
</script>

<style lang="stylus" scoped>
.player
  --margins: 10px
  background: var(--bg-dark)
  width: 100%
  height: calc(var(--bottom-player-height) - var(--margins) * 2)
  display: flex
  padding: var(--margins)
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.5)

  &.bottom-player-enter-active, &.bottom-player-leave-active
    transition: var(--transition-medium) var(--ease)

  &.bottom-player-enter, &.bottom-player-leave-to
    height: 0
    padding: 0 var(--margins)

  img.artwork
    width: calc(var(--bottom-player-height) - var(--margins) * 2)
    border-radius: var(--border-radius)
    margin-right: var(--margins)
    box-shadow: var(--small-artwork-shadow)

  .right
    flex-grow: 1
    display: flex
    flex-direction: column

    .upper
      display: flex

      .track-info
        margin-top: 4px
        font-size: 0.9375rem

        .title, .artist
          padding-left: 1px
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical

        .title
          line-height: 1.333em
          font-size: 1em
          font-weight: 700

        .artist
          line-height: 1.333em
          font-size: 0.85em

      .spacer
        flex-grow: 1

      .controls
        --controls-size: clamp(30px, 2.375rem, 45px)
        --playpause-size: calc(var(--controls-size) * 1.105)
        height: var(--playpause-size)
        display: flex
        align-items: center
        margin-right: calc(var(--margins) * 2)

        > div
          height: var(--controls-size)

          i.mi
            font-size: var(--controls-size)
            height: var(--controls-size)
            color: var(--text-white)
            cursor: pointer

        > .play-pause
          height: var(--playpause-size)

          i.mi
            font-size: var(--playpause-size)
            height: var(--playpause-size)
</style>