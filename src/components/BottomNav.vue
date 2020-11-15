<template>
  <nav class="bottom">
    <router-link to="/">
      <i class="mi">home</i>
    </router-link>
    <router-link to="/search">
      <i class="mi">search</i>
    </router-link>
    <router-link to="/playlist/soundcloud/1162452736">
      <i class="mi">library_music</i>
    </router-link>
  </nav>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "bottom-nav",
})
</script>

<style lang="stylus" scoped>
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
    padding: calc((var(--bottom-nav-height) - var(--icon-size)) / 2) var(--icon-size)

    > i.mi
      font-size: inherit
      color: var(--text-light)
      transition: var(--transition-short)

    &.router-link-exact-active > i.mi
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.333)
      color: var(--text-white)
</style>