<template>
  <div class="height-transition" ref="wrap" :style="{ 'max-height': `${height}px` }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data: () => ({
    initialHeight: 0,
  }),
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    this.initialHeight = this.$refs.wrap.scrollHeight
  },
  computed: {
    height() {
      return this.collapsed ? 0 : this.initialHeight
    },
  },
})
</script>

<style lang="stylus">
.height-transition
  width: 100%
  overflow: hidden
  transition: max-height var(--transition-short) var(--ease)
</style>