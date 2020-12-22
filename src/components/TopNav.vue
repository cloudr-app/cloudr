<template>
  <nav class="top" :class="{ scrolled }">
    <!-- <i class="mi" @click="$router.back()" v-if="$route.fullPath !== '/'">arrow_back</i> -->
    <div class="spacer"></div>
    <!-- <i class="mi" @click="$router.back()" v-if="$route.fullPath !== '/'">sort</i> -->
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

  > i.mi
    font-size: var(--icon-size)
    margin: auto 14px
    cursor: pointer
</style>