<template>
  <div class="artwork" :class="{ expanded }" @click="expand">
    <img :src="artwork" alt="artwork not found" draggable="false" />
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
  data: () => ({
    expanded: false,
  }),
  methods: {
    async expand() {
      this.expanded = !this.expanded

      if (this.expanded) window.addEventListener("pointerdown", this.outsideClick, false)
      else window.removeEventListener("pointerdown", this.outsideClick)
    },
    outsideClick(event: any) {
      if (event.target.closest(".artwork")) return
      this.expanded = false

      window.removeEventListener("pointerdown", this.outsideClick)
    },
  },
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
  width: calc(100% - 60px)
  max-width: 40vh
  display: flex
  border-radius: var(--border-radius-large)
  overflow: hidden
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.25)
  position: relative
  transition: var(--transition-short) var(--ease)

  .overlay
    height: 50%
    width: 100%
    background: linear-gradient(to bottom, transparent, var(--artwork-gradient))
    position: absolute
    bottom: 0
    left: 0
    transition: var(--transition-short) var(--ease)
    pointer-events: none

    .info
      position: absolute
      bottom: var(--title-offset)
      left: var(--title-offset)

      .title, .author
        margin-right: var(--title-offset)

      .title
        font-size: 1.625rem
        font-weight: bold
        letter-spacing: 1px
        color: var(--text-white)
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical

      .author
        font-size: 1rem

  img
    width: calc(100% - var(--artwork-render-correction) * 2)
    border-radius: var(--border-radius-large)
    border: var(--artwork-render-correction) solid var(--bg)
    transition: 0 var(--transition-short) var(--ease)

  &.expanded
    width: calc(100% - 20px)
    max-width: 50vh
    border-radius: 0

    img
      border-radius: 0
      width: 100%
      border: none

    .overlay
      transform: translateY(100%)
</style>