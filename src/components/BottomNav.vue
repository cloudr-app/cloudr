<template>
  <nav class="bottom">
    <router-link to="/">
      <svg-icon icon="home" />
    </router-link>
    <router-link to="/search">
      <svg-icon icon="search" />
    </router-link>
    <router-link to="/soundcloud/playlist/1162452736">
      <svg-icon icon="library_music" />
    </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "bottom-nav",
})
</script>

<style lang="sass" scoped>
nav.bottom
  height: var(--bottom-nav-height)
  width: 100%
  z-index: 10
  background: var(--bg-dark)
  display: flex
  justify-content: space-around
  align-items: center

  > a
    font-size: var(--icon-size)
    line-height: 1ch
    cursor: pointer
    padding: calc(((var(--bottom-nav-height) - var(--icon-size)) / 2)) var(--icon-size)

    > svg.icon
      font-size: inherit
      color: var(--text-light)
      transition: var(--transition-short)

    &.router-link-exact-active > svg.icon
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.333))
      fill: var(--text-white)
</style>
