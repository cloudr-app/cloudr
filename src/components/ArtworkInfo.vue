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
  --title-offset: 20px
  width: calc(100% - 20px)
  max-width: 360px
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
      bottom: var(--title-offset)
      left: var(--title-offset)

      .title, .author
        margin-right: var(--title-offset)

      .title
        font-size: 26px
        font-weight: bold
        letter-spacing: 1px
        color: var(--fg-white)
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical

      .author
        font-size: 16px

  img
    width: calc(100% - 2px)
    border-radius: var(--border-radius-large)
    border: 1px solid var(--bg)
</style>