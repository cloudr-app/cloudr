<template>
  <global-styles id="app" :class="{ noTrack }">
    <svg-sprite />
    <top-nav :scrolled="scrolled" />
    <main ref="main" class="rw">
      <router-view :key="$route.name" />
    </main>
    <transition name="bottom-player">
      <bottom-player v-if="!noTrack" />
    </transition>
    <bottom-nav />
    <audio-player v-if="currentTrack.stream" />
  </global-styles>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue"
import { useStore } from "./store/store"

import SvgSprite from "@/components/functional/SvgSprite"
import topNav from "@/components/TopNav.vue"
import bottomNav from "@/components/BottomNav.vue"
import bottomPlayer from "@/components/BottomPlayer.vue"
import globalStyles from "@/components/functional/GlobalStyles"
import audioPlayer from "@/components/functional/AudioPlayer"

import player from "@/player"
import { useRoute, useRouter } from "vue-router"

// @ts-expect-error
window.player = player

export default defineComponent({
  components: { topNav, bottomNav, bottomPlayer, audioPlayer, globalStyles, SvgSprite },
  setup() {
    const { state } = useStore()
    const scrolled = ref(false)
    const main = ref<HTMLElement | null>(null)

    if (process.env.NODE_ENV === "development") {
      // for debugging
      // @ts-expect-error
      window.route = useRoute()
      // @ts-expect-error
      window.router = useRouter()
      // @ts-expect-error
      window.store = useStore()
    }

    onMounted(() => {
      if (!main.value) throw new Error("template ref not available at mount")
      main.value.onscroll = (e: any) => {
        if (e.target.scrollTop > 0) scrolled.value = true
        else scrolled.value = false
      }
    })

    const noTrack = computed(() => {
      const allEmpty = (arr: string[]) => !arr.filter(s => s).length

      const { artist, id, stream, title } = state.currentTrack
      return allEmpty([artist, id, stream, title])
    })

    return {
      scrolled,
      main,
      noTrack,
      currentTrack: computed(() => state.currentTrack),
    }
  },
})
</script>

<style lang="sass">
@use "./components/mwc/theme.css"

:root
  --bg: #222436
  --bg-dark: #1E2030
  --accent: #7981c4
  --text-white: #FFFFFF
  --text-light: #C8C8CD
  --text-m-light: #9092a2
  --text-x-light: #343644
  --text-trans-white: 255, 255, 255
  --text-highlight: #cec2ff
  --text-light-highlight: #aeaed5
  --small-artwork-highlight: 0 0 0 1px var(--text-white)
  --artwork-render-correction: 1px
  --artwork-gradient: rgba(34, 36, 54, 0.95)
  // should be between .75 and 1.333
  --global-font-size: 1em
  --font: "manrope", "Roboto", sans-serif
  --ease: cubic-bezier(0.76, 0, 0.24, 1)
  --ease-less: cubic-bezier(0.45, 0, 0.55, 1)
  --transition-x-short: 100ms
  --transition-short: 200ms
  --transition-medium: 500ms
  --top-nav-height: 56px
  --bottom-nav-height: 56px
  --bottom-player-height: 4.625rem
  --border-radius: 5px
  --border-radius-large: 15px
  --icon-size: 30px
  --small-artwork-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)

@font-face
  font-family: "manrope"
  src: url("./assets/manrope.ttf")
  font-display: swap

@font-face
  font-family: "Roboto Mono"
  src: url("./assets/RobotoMono.ttf")
  font-style: normal
  font-weight: 300
  font-display: swap

html, body
  margin: 0
  background: var(--bg)
  color: var(--text-light)
  font-family: var(--font)
  font-size: var(--global-font-size)
  height: 100%
  width: 100%
  user-select: none
  -webkit-tap-highlight-color: transparent

.height-transition
  width: 100%
  overflow: hidden
  transition: max-height var(--transition-short) var(--ease)

svg.icon
  fill: currentColor
  height: 1em
  vertical-align: middle
  width: 1em

button
  border: 1px solid var(--text-light)
  background: none
  color: var(--text-light)
  padding: 0.5em 1em
  border-radius: var(--border-radius)
  outline: none
  transition: background var(--transition-short)
  font-family: var(--font)

  &:active
    background: rgba(var(--text-trans-white), 0.2)

*
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  letter-spacing: 0.03em
  color: var(--text-light)

  @media screen and (min-width: 500px)
    ::-webkit-scrollbar
      width: 8px

    ::-webkit-scrollbar-track
      background: transparent

    ::-webkit-scrollbar-thumb
      background: var(--text-x-light)
      background-clip: padding-box
      border-radius: 4px
      border: 2px solid transparent
      width: 4px

      &:hover
        background: var(--text-light)
        background-clip: padding-box
        border-radius: 6px
        border: 1px solid transparent
        width: 4px

#app
  height: 100%
  width: 100%
  background: var(--bg)

  > nav
    position: fixed

    &.bottom
      bottom: 0

  > .player
    position: fixed
    bottom: var(--bottom-nav-height)

  > main
    --navigation-size: calc(var(--top-nav-height) + var(--bottom-nav-height) + var(--bottom-player-height))
    position: fixed
    height: calc(100% - var(--navigation-size))
    top: var(--top-nav-height)
    width: 100%
    overflow: auto
    transition: var(--transition-medium) var(--ease)

  &.noTrack
    > main
      --navigation-size: calc(var(--top-nav-height) + var(--bottom-nav-height))
</style>
