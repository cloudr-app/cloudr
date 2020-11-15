<template>
  <div id="app">
    <top-nav :scrolled="scrolled" />
    <main ref="main" class="rw">
      <router-view />
    </main>
    <bottom-nav />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import soundcloud from "./player/soundcloud"
import topNav from "./components/TopNav.vue"
import bottomNav from "./components/BottomNav.vue"

declare global {
  interface Window {
    soundcloud: any
    vue: any
  }
}

window.soundcloud = soundcloud
export default Vue.extend({
  components: { topNav, bottomNav },
  data: () => ({
    scrolled: false,
  }),
  mounted() {
    const self = this

    // for debugging
    window.vue = self

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
  --ease: cubic-bezier(0.76, 0, 0.24, 1)
  --ease-less: cubic-bezier(0.45, 0, 0.55, 1)
  --top-nav-height: 56px
  --bottom-nav-height: 56px
  --border-radius: 5px
  --border-radius-large: 15px
  --artwork-gradient: rgba(34, 36, 54, 0.95)
  --transition-short: 200ms

@font-face
  font-family: "manrope"
  src: url("./assets/manrope.ttf")

html, body
  margin: 0
  background: var(--bg)
  color: var(--text-light)
  font-family: "manrope"
  height: 100%
  width: 100%
  user-select: none
  -webkit-tap-highlight-color: transparent

*
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  letter-spacing: 0.03em
  color: var(--text-light)

#app
  height: 100%
  width: 100%

  > nav
    position: fixed

    &.bottom
      bottom: 0

  > main
    position: fixed
    height: calc(100% - var(--top-nav-height) - var(--bottom-nav-height))
    top: var(--top-nav-height)
    width: 100%
    overflow: auto

    > .rw
      height: 100%
      width: 100%
</style>
