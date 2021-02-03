<template>
  <nav class="top" :class="{ scrolled }">
    <div class="back" @click="$router.back()" v-if="$route.fullPath === '/preferences'">
      <svg-icon icon="arrow_back" />
    </div>
    <div class="spacer"></div>
    <div
      class="settings"
      @click="$router.push('/preferences')"
      v-if="$route.fullPath !== '/preferences'"
    >
      <svg-icon icon="settings" />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "top-nav",
  props: {
    scrolled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="sass" scoped>
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

  > div
    margin: auto 14px

  svg.icon
    font-size: calc(var(--icon-size) * 0.75)
    cursor: pointer
    opacity: 0.5
</style>
