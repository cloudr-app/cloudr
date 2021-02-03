<template>
  <div class="slider" :style="{ '--margin-amt': marginAmt }">
    <div class="prefix" :style="{ width: `${prefix.length}ch` }" v-if="prefix">
      {{ prefix }}
    </div>
    <div
      class="scrubber"
      :style="{ '--position': `${position * 100}%` }"
      :class="{ animated, moving }"
      @touchstart="touchStart"
      @mousedown="mouseDown"
      @contextmenu="contextmenu"
    >
      <div class="bar"></div>
      <div class="position"></div>
      <div class="handle"></div>
    </div>
    <div class="postfix" :style="{ width: `${postfix.length}ch` }" v-if="postfix">
      {{ postfix }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

import { touchEventOffset } from "@/utils"

let skipValueUpdates = 0

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 0,
    },
    prefix: {
      type: String,
    },
    postfix: {
      type: String,
    },
    immediate: {
      type: Boolean,
      default: false,
    },
    updateSlack: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const positionOverride = ref(false)
    const override = ref(0)
    const animated = ref(false)
    const touching = ref(false)
    const moving = ref(false)
    const lastEmitted = ref(false)

    return {
      positionOverride,
      animated,
      touching,
      moving,
      lastEmitted,
      override,
    }
  },
  computed: {
    marginAmt() {
      let amt = 0
      if (this.prefix) amt++
      if (this.postfix) amt++
      return amt
    },
    position(): number {
      return this.positionOverride ? this.override : this.value
    },
  },
  watch: {
    value() {
      if (skipValueUpdates > 1) skipValueUpdates--
      else if (skipValueUpdates === 1) {
        skipValueUpdates = 0
        this.positionOverride = false
      }
    },
  },
  methods: {
    // TODO check if duplicates still happen
    emit(_: string, value: any) {
      if (this.lastEmitted !== value) {
        this.lastEmitted = value
        this.$emit("input", value)
      }
    },
    contextmenu(event: any) {
      event.preventDefault()
    },
    mouseDown(event: any) {
      // TODO fix mouse sliding when out of bounds
      this.touching = true

      const position = event.offsetX / event.target.scrollWidth
      this.positionOverride = true
      this.override = position

      event.target.onmousemove = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        this.positionOverride = true
        this.override = pos
        if (this.immediate) this.emit("input", pos)
      }

      event.target.onmouseup = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        event.target.onmousemove = null
        if (this.updateSlack > 0) skipValueUpdates = this.updateSlack
        else this.positionOverride = false
        this.touching = false

        this.emit("input", pos)
      }
    },
    touchStart(event: any) {
      this.touching = true
      this.moving = false

      event.target.ontouchmove = (evt: any) => {
        this.moving = true
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = Math.min(Math.max(offX / evt.target.scrollWidth, this.min), this.max)
        this.positionOverride = true
        this.override = pos
        if (this.immediate) this.emit("input", pos)
      }

      event.target.ontouchend = (evt: any) => {
        this.moving = false
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = Math.min(Math.max(offX / evt.target.scrollWidth, this.min), this.max)
        event.target.ontouchmove = null
        this.touching = false
        if (this.updateSlack > 0) skipValueUpdates = this.updateSlack
        else this.positionOverride = false

        this.emit("input", pos)
      }
    },
  },
})
</script>

<style lang="sass" scoped>
.slider
  --margins: 10px
  --margin-amt: 0
  --height: 5px
  width: calc(100% - var(--margins) * var(--margin-amt))
  flex-grow: 1
  display: flex
  align-items: center
  height: calc(var(--height) * 3)

  .postfix, .prefix
    font-size: 0.6875rem
    margin-left: var(--margins)
    text-align: center

  .prefix
    margin-left: 0
    margin-right: var(--margins)

  .scrubber
    --position: 0
    --transition: var(--transition-x-short)
    display: flex
    align-items: center
    height: 100%
    position: relative
    flex-grow: 1
    padding: 4px 0
    margin: -4px 0

    > div
      position: absolute
      pointer-events: none

    >.bar, >.position
      background: var(--text-x-light)
      width: 100%
      height: var(--height)
      border-radius: 2px

    >.position
      background: var(--text-light)
      width: var(--position)
      transition-duration: var(--transition)
      transition-property: width

    >.handle
      background: var(--text-white)
      height: calc(var(--height) * 2)
      width: calc(var(--height) * 2)
      border-radius: 50%
      left: calc(var(--position) - var(--height))
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)
      transition-duration: var(--transition), var(--transition), var(--transition)
      transition-property: height, width, left

      &.touching
        height: 14px
        width: 14px
        left: calc(var(--position) - 7px)

    &.moving
      >.handle, >.position
        transition-duration: 0s
</style>
