<template>
  <div class="player">
    <img :src="$store.state.currentTrack.artwork" alt="track art" class="artwork" />
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
        <div class="current-time">{{ formatTime(position * duration) }}</div>
        <div
          class="scrubber"
          :style="{ '--progress': `${position * 100}%` }"
          @touchstart="scrubberTouchStart"
          @mousedown="scrubberMouseDown"
        >
          <div class="bar"></div>
          <div class="progress"></div>
          <div class="handle"></div>
        </div>
        <div class="duration">{{ formatTime(duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"
import { touchEventOffset, formatTime } from "@/utils"

export default Vue.extend({
  name: "bottomPlayer",
  data: () => ({
    positionOverride: false,
  }),
  computed: {
    position() {
      return this.positionOverride !== false ? this.positionOverride : this.progress
    },
    ...mapState({
      progress: (state: any) => state.player.progress,
      duration: (state: any) => state.player.duration,
      title: (state: any) => state.currentTrack.title,
      artist: (state: any) => state.currentTrack.artist,
    }),
  },
  methods: {
    formatTime,
    playPause() {
      const { commit } = this.$store
      const state = this.$store.state as State

      commit("setPlayer", ["playing", !state.player.playing])
    },
    scrubberMouseDown(event: any) {
      const self = this
      const { commit } = this.$store

      const position = event.offsetX / event.target.scrollWidth
      this.positionOverride = position

      event.target.onmousemove = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        self.positionOverride = pos
      }

      event.target.onmouseup = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        event.target.onmousemove = null
        self.positionOverride = false
        commit("setPlayer", ["setPosition", pos])
      }
    },
    scrubberTouchStart(event: any) {
      const self = this
      const { commit } = this.$store

      event.target.ontouchmove = (evt: any) => {
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = offX / evt.target.scrollWidth
        self.positionOverride = Math.min(Math.max(pos, 0), 1)
      }

      event.target.ontouchend = (evt: any) => {
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = offX / evt.target.scrollWidth
        event.target.ontouchmove = null
        self.positionOverride = false
        commit("setPlayer", ["setPosition", pos])
      }
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
        font-size: 15px

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
        --controls-size: 38px
        --playpause-size: 42px
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

    .lower
      width: calc(100% - var(--margins) * 2)
      flex-grow: 1
      display: flex
      align-items: center
      padding-bottom: 4px

      .duration, .current-time
        font-size: 11px
        margin-left: var(--margins)
        font-family: "Roboto Mono", monospace

      .current-time
        margin-left: 0
        margin-right: var(--margins)

      .scrubber
        --progress: 0
        display: flex
        align-items: center
        height: 100%
        position: relative
        flex-grow: 1
        padding: 4px 0
        margin: -4px 0

        > div
          position: absolute
          pointer-events: none

        .bar, .progress
          background: var(--text-x-light)
          width: 100%
          height: 4px
          border-radius: 2px

        .progress
          background: var(--text-light)
          width: var(--progress)

        .handle
          background: var(--text-white)
          height: 10px
          width: 10px
          border-radius: 50%
          left: calc(var(--progress) - 5px)
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)
</style>