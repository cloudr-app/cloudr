<template>
  <div
    class="track"
    @click="$emit('play-track')"
    ref="main"
    :style="{ height: height > 0 ? `${height}px` : null }"
    :class="{ 'is-playing': isPlaying }"
  >
    <div class="main" v-if="!hide">
      <div class="artwork">
        <img :src="imgSrc" alt="track artwork" />
      </div>
      <div class="info">
        <div class="title">{{ trackInfo.title }}</div>
        <div class="author">{{ trackInfo.user.username }}</div>
      </div>
      <div class="actions">
        <!-- <div class="quick-action">
          <svg-icon icon="queue" />
        </div> -->
        <div class="options">
          <svg-icon icon="more_vert" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs, PropType, watch } from "vue"

import { toCloudrID, getImageLargerThan } from "@/utils"
import { Track } from "@/player/musicSource"
import { useStore } from "@/store/store"

export default defineComponent({
  props: {
    trackInfo: {
      type: Object as PropType<Track>,
      required: true,
    },
  },
  setup(props) {
    const hide = ref(false)
    const height = ref(0)
    const main = ref<HTMLElement | null>(null)
    const { trackInfo } = toRefs(props)
    const { state } = useStore()

    const isPlaying = computed(() => {
      const { platform, id } = trackInfo.value
      return toCloudrID(platform, id) === state.currentTrack.id
    })

    watch(hide, () => {
      if (!main.value) return
      if (hide.value) height.value = main.value.scrollHeight
      else height.value = 0
    })

    return {
      hide,
      height,
      isPlaying,
      imgSrc: computed(() => {
        const images = trackInfo.value.artwork
        if (!images.length) return

        return getImageLargerThan(images, 40).src
      }),
    }
  },
})
</script>

<style lang="sass" scoped>
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

        > svg.icon
          margin-left: 12px
          font-size: 1.5em

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
        font-size: 0.875rem
        font-weight: 500
        font-variation-settings: "wght" 500

      .author
        font-size: 0.75rem
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