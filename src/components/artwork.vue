<template>
  <div class="artwork">
    <img :src="artwork" alt="artwork not found" />
    <div class="overlay">
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="author">{{ author }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    artwork: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    author: {
      required: true,
      type: String,
    },
  },
})
</script>

<style lang="stylus" scoped>
.artwork
  max-width: 85%
  display: flex
  border-radius: var(--border-radius-large)
  overflow: hidden
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.25)
  position: relative

  .overlay
    height: 50%
    width: 100%
    background: linear-gradient(to bottom, transparent, var(--artwork-gradient))
    position: absolute
    bottom: 0
    left: 0

    .info
      position: absolute
      bottom: 15px
      left: 15px

      .title
        font-size: 24px
        font-weight: bold
        letter-spacing: 1px
        color: var(--fg-white)

      .author
        font-size: 14px

  img
    max-width: calc(100% - 2px)
    border-radius: var(--border-radius-large)
    border: 1px solid var(--bg)
</style>