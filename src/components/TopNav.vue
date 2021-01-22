<template>
  <nav class="top" :class="{ scrolled }">
    <svg-icon
      icon="arrow_back"
      @click="$router.back()"
      v-if="$route.fullPath === '/preferences'"
    />
    <div class="spacer"></div>
    <svg-icon
      icon="settings"
      @click="$router.push('/preferences')"
      v-if="$route.fullPath !== '/preferences'"
    />
  </nav>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "top-nav",
  props: {
    scrolled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="stylus" scoped>
nav.top
  height: var(--top-nav-height)
  width: 100%
  z-index: 10
  transition: box-shadow var(--transition-short)
  display: flex
  background: var(--bg)

  &.scrolled
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5)

  > .spacer
    flex-grow: 1

  > svg.icon
    font-size: calc(var(--icon-size) * 0.75)
    margin: auto 14px
    cursor: pointer
    opacity: 0.5
</style>