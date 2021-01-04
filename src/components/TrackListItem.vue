<template>
  <div
    class="track"
    @click="$emit('playTrack')"
    ref="main"
    :style="{ height: height > 0 ? `${height}px` : null }"
    :class="{ 'is-playing': isPlaying }"
  >
    <div class="main" v-if="!hide">
      <div class="artwork">
        <img :src="trackInfo.artwork" alt="track artwork" />
      </div>
      <div class="info">
        <div class="title">{{ trackInfo.title }}</div>
        <div class="author">{{ trackInfo.user.username }}</div>
      </div>
      <div class="actions">
        <!-- <div class="quick-action">
          <i class="mi">queue</i>
        </div> -->
        <div class="options">
          <i class="mi">more_vert</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { toCloudrID } from "@/utils"

export default Vue.extend({
  name: "track-list-item",
  props: {
    trackInfo: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    hide: false,
    height: 0,
  }),
  computed: {
    isPlaying() {
      const { platform, id } = this.trackInfo
      return toCloudrID(platform, id) === this.$store.state.currentTrack.id
    },
  },
  watch: {
    hide(n) {
      if (n) this.height = this.$refs.main.scrollHeight
      else this.height = 0
    },
  },
})
</script>

<style lang="stylus" scoped>
.track
  padding: 0 12.5px
  cursor: pointer

  .main
    height: 54px
    display: flex
    align-items: center

    .actions
      margin-left: auto
      display: flex

      > div
        height: 100%
        display: flex
        align-items: center
        cursor: pointer

        > i
          margin-left: 12px

    .info
      max-width: calc(100% - 50px - 36px)

      .title, .author
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 1
        -webkit-box-orient: vertical

      .title
        color: var(--text-white)
        font-size: 14px
        font-weight: 500
        font-variation-settings: "wght" 500

      .author
        font-size: 12px
        font-weight: 400
        font-variation-settings: "wght" 400

    .artwork
      height: 40px
      width: 40px
      overflow: hidden
      border-radius: var(--border-radius)
      box-shadow: var(--small-artwork-shadow)
      margin-right: 10px
      transition: var(--transition-short)

      img
        height: 100%

  &.is-playing
    .main
      .info
        .title
          color: var(--text-highlight)

        .author
          color: var(--text-light-highlight)

    .artwork
      box-shadow: var(--small-artwork-highlight)
</style>