<template>
  <div class="slider">
    <div class="prefix" v-if="prefix">{{ prefix }}</div>
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
    <div class="postfix" v-if="postfix">{{ postfix }}</div>
  </div>
</template>

<script lang="ts">
import { touchEventOffset } from "@/utils"
import Vue from "vue"
const debounce = (fn: Function, ms = 0) => {
  let tid: number
  return function (...args: any[]) {
    clearTimeout(tid), (tid = setTimeout(() => fn.apply(this, args), ms))
  }
}

let skipValueUpdates = 0

export default Vue.extend({
  data: () => ({
    positionOverride: false,
    animated: false,
    touching: false,
    moving: false,
    lastEmitted: false,
  }),
  computed: {
    position() {
      return this.positionOverride !== false ? this.positionOverride : this.value
    },
  },
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
    /**
     * prevent duplicate emissions
     */
    emit: debounce(function (type: string, value: any) {
      if (this.lastEmitted !== value) {
        this.lastEmitted = value
        this.$emit("input", value)
      }
    }, 10),
    contextmenu(event: any) {
      event.preventDefault()
    },
    mouseDown(event: any) {
      // TODO fix mouse sliding when out of bounds
      const self = this
      self.touching = true

      const position = event.offsetX / event.target.scrollWidth
      self.positionOverride = position

      event.target.onmousemove = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        self.positionOverride = pos
        if (self.immediate) self.emit("input", pos)
      }

      event.target.onmouseup = (evt: any) => {
        const pos = evt.offsetX / evt.target.scrollWidth
        event.target.onmousemove = null
        if (self.updateSlack > 0) skipValueUpdates = self.updateSlack
        else self.positionOverride = false
        self.touching = false

        self.emit("input", pos)
      }
    },
    touchStart(event: any) {
      const self = this
      self.touching = true
      self.moving = false

      event.target.ontouchmove = (evt: any) => {
        self.moving = true
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = Math.min(Math.max(offX / evt.target.scrollWidth, self.min), self.max)
        self.positionOverride = pos
        if (self.immediate) self.emit("input", pos)
      }

      event.target.ontouchend = (evt: any) => {
        self.moving = false
        const [offX] = touchEventOffset(evt.changedTouches[0], event.target)
        const pos = Math.min(Math.max(offX / evt.target.scrollWidth, self.min), self.max)
        event.target.ontouchmove = null
        self.touching = false
        if (self.updateSlack > 0) skipValueUpdates = self.updateSlack
        else self.positionOverride = false

        self.emit("input", pos)
      }
    },
  },
})
</script>

<style lang="stylus" scoped>
.slider
  --margins: 10px
  width: calc(100% - var(--margins) * 2)
  flex-grow: 1
  display: flex
  align-items: center
  padding-bottom: 4px

  .postfix, .prefix
    font-size: 0.6875rem
    margin-left: var(--margins)
    font-family: "Roboto Mono", monospace

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
      height: 5px
      border-radius: 2px

    >.position
      background: var(--text-light)
      width: var(--position)
      transition-duration: var(--transition)
      transition-property: width

    >.handle
      background: var(--text-white)
      height: 10px
      width: 10px
      border-radius: 50%
      left: calc(var(--position) - 5px)
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