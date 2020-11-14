<template>
  <div id="app">
    <top-nav />
    <main class="rw">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import soundcloud from "./player/soundcloud"
import topNav from "./components/TopNav.vue"

declare global {
  interface Window {
    soundcloud: any
    vue: any
  }
}

window.soundcloud = soundcloud
export default Vue.extend({
  mounted() {
    // for debugging
    window.vue = this
  },
  components: { topNav },
})
</script>

<style lang="stylus">
@import "./assets/material-icons.css"

:root
  --bg: #222436
  --bg-dark: #1E2030
  --fg-white: #FFFFFF
  --fg-light: #C8C8CD
  --fg-x-light: #343644
  --fg-trans-white: #FFFFFF
  --ease: cubic-bezier(0.76, 0, 0.24, 1)
  --ease-less: cubic-bezier(0.45, 0, 0.55, 1)
  --nav-height: 56px
  --border-radius: 5px
  --border-radius-large: 15px
  --artwork-gradient: rgba(34, 36, 54, 0.95)

@font-face
  font-family: "manrope"
  src: url("./assets/manrope.ttf")

html, body
  margin: 0
  background: var(--bg)
  color: var(--fg-light)
  font-family: "manrope"
  height: 100%
  width: 100%
  user-select: none

input, a, span, p
  color: var(--fg-light)

#app
  height: 100%
  width: 100%

  > main
    height: calc(100% - var(--nav-height))
    width: 100%

    > .rw
      height: 100%
      width: 100%
</style>
