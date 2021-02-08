<template>
  <div class="player">
    <cloudr-image :src="imgSrc" alt="track art" class="artwork" />
    <div class="right">
      <div class="upper">
        <div class="track-info">
          <div class="title" :title="title">{{ title }}</div>
          <div class="artist" :title="artist">{{ artist }}</div>
        </div>
        <div class="spacer"></div>
        <div class="controls">
          <div class="skip-previous" @click="prevTrack">
            <svg-icon icon="skip_previous" />
          </div>
          <div class="play-pause" @click="playPause">
            <svg-icon v-if="playing" icon="pause" />
            <svg-icon v-else icon="play_arrow" />
          </div>
          <div class="skip-next" @click="nextTrack">
            <svg-icon icon="skip_next" />
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
import { defineComponent, computed } from "vue"
import CloudrImage from "@/components/functional/CloudrImage"

import { formatTime, srcset } from "@/utils"

import Slider from "@/components/Slider.vue"
import { useStore } from "@/store/store"

export default defineComponent({
  components: { Slider, CloudrImage },
  setup() {
    const { state, commit, dispatch } = useStore()

    const playing = computed(() => state.player.playing)
    const playPause = () => commit("setPlayer", ["playing", !playing.value])
    const sliderVal = (pos: number) => commit("setPlayer", ["setPosition", pos])

    return {
      formatTime,
      playPause,
      sliderVal,
      playing,
      prevTrack: () => dispatch("prevTrack"),
      nextTrack: () => dispatch("nextTrack"),
      progress: computed(() => state.player.progress),
      duration: computed(() => state.player.duration),
      title: computed(() => state.currentTrack.title),
      artist: computed(() => state.currentTrack.artist),
      imgSrc: computed(() => srcset(state.currentTrack.artwork, 55)),
    }
  },
})
</script>

<style lang="sass" scoped>
.player
  --margins: 10px
  background: var(--bg-dark)
  width: calc(100% - var(--margins) * 2)
  height: calc(var(--bottom-player-height) - var(--margins) * 2)
  display: flex
  padding: var(--margins)
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.5)

  &.bottom-player-enter-active, &.bottom-player-leave-active
    transition: var(--transition-medium) var(--ease)

  &.bottom-player-enter-from, &.bottom-player-leave-to
    transform: translateY(100%)
    box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0)

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
      flex-grow: 1

      .track-info
        margin-top: 4px
        font-size: 0.9rem

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

        > div
          height: var(--controls-size)

          svg.icon
            font-size: var(--controls-size)
            height: var(--controls-size)
            fill: var(--text-white)
            cursor: pointer

        > .play-pause
          height: var(--playpause-size)

          svg.icon
            font-size: var(--playpause-size)
            height: var(--playpause-size)
</style>
