<template>
  <div id="app" :class="{ noTrack }">
    <top-nav :scrolled="scrolled" />
    <main ref="main" class="rw">
      <router-view />
    </main>
    <transition name="bottom-player">
      <bottom-player v-if="!noTrack" />
    </transition>
    <bottom-nav />
    <audio-player
      v-if="$store.state.currentTrack.stream"
      :src="$store.state.currentTrack.stream"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import topNav from "@/components/TopNav.vue"
import bottomNav from "@/components/BottomNav.vue"
import bottomPlayer from "@/components/BottomPlayer.vue"

import audioPlayer from "@/components/AudioPlayer.vue"

import soundcloud from "@/player/soundcloud"
import player from "@/player"

declare global {
  interface Window {
    soundcloud: any
    vue: any
    player: any
  }
}

window.soundcloud = soundcloud
export default Vue.extend({
  components: { topNav, bottomNav, bottomPlayer, audioPlayer },
  data: () => ({
    scrolled: false,
  }),
  computed: {
    noTrack() {
      const allEmpty = (arr: string[]) => !arr.filter(s => s.length).length

      const { currentTrack } = this.$store.state as State
      const { artist, id, stream, title } = currentTrack
      return allEmpty([artist, id, stream, title])
    },
  },
  async mounted() {
    const self = this

    // for debugging
    window.vue = self
    window.player = player

    // cspell:ignore onscroll
    const { main } = self.$refs as any
    main.onscroll = (e: any) => {
      if (e.target.scrollTop > 0) self.scrolled = true
      else self.scrolled = false
    }
  },
})
</script>

<style lang="stylus">
@import "./assets/material-icons.css"

:root
  --bg: #222436
  --bg-dark: #1E2030
  --text-white: #FFFFFF
  --text-light: #C8C8CD
  --text-x-light: #343644
  --text-trans-white: #FFFFFF
  --text-highlight: #cec2ff
  --text-light-highlight: #aeaed5
  // should be between .75 and 1.333
  --global-font-size: 1em
  --ease: cubic-bezier(0.76, 0, 0.24, 1)
  --ease-less: cubic-bezier(0.45, 0, 0.55, 1)
  --transition-short: 200ms
  --transition-medium: 500ms
  --top-nav-height: 56px
  --bottom-nav-height: 56px
  --bottom-player-height: 4.625rem
  --border-radius: 5px
  --border-radius-large: 15px
  --artwork-gradient: rgba(34, 36, 54, 0.95)
  --icon-size: 30px
  --small-artwork-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)
  --small-artwork-highlight: 0 0 0 1px var(--text-white)

@font-face
  font-family: "manrope"
  src: url("./assets/manrope.ttf")

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
  font-family: "manrope"
  font-size: var(--global-font-size)
  height: 100%
  width: 100%
  user-select: none
  -webkit-tap-highlight-color: transparent

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

    > .rw
      height: 100%
      width: 100%

  &.noTrack
    > main
      --navigation-size: calc(var(--top-nav-height) + var(--bottom-nav-height))
</style>
