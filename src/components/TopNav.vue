<template>
  <nav class="top" :class="{ scrolled }">
    <div class="left">
      <i class="mi" @click="$router.back()" v-if="$route.fullPath !== '/'">arrow_back</i>
    </div>
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
  height: var(--nav-height)
  width: 100%
  z-index: 10
  transition: box-shadow var(--transition-short)

  &.scrolled
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5)

  > .left > i.mi
    font-size: 28px
    margin: 14px
    cursor: pointer
</style>