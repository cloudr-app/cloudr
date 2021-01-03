<template>
  <div class="infinite-scroll" ref="wrap">
    <slot></slot>
  </div>
</template>

<script lang="ts">
let endObserver: IntersectionObserver
let observed: HTMLElement

let hideObserver: IntersectionObserver
const hideObserved: boolean[] = []

import Vue from "vue"
export default Vue.extend({
  name: "infinite-scroll",
  props: {
    list: {
      type: Array,
      required: true,
    },
    root: {
      type: String,
      required: true,
    },
  },
  created() {
    endObserver = new IntersectionObserver(this.intersectionCallback, {
      root: document.querySelector(this.root),
    })
    hideObserver = new IntersectionObserver(this.hideCallback, {
      root: document.querySelector(this.root),
    })
  },
  beforeDestroy() {
    endObserver.disconnect()
  },
  watch: {
    async list() {
      if (observed) endObserver.unobserve(observed)

      await this.$nextTick()
      this.assignHideObservers()

      const children = this.$refs.wrap.children
      observed = children[children.length - 11]
      if (observed) endObserver.observe(observed)
    },
  },
  methods: {
    intersectionCallback(entries: IntersectionObserverEntry[]) {
      const self = this
      entries.forEach(entry => {
        if (entry.isIntersecting) self.$emit("end")
      })
    },
    assignHideObservers() {
      const self = this
      const children = this.$refs.wrap.children as HTMLElement[]
      const slotChildren = self.$slots.default

      if (children.length !== slotChildren.length)
        throw new Error("children length and slot content length are not the same.")

      children.forEach((child: HTMLElement, index: number) => {
        if (hideObserved[index]) return

        hideObserver.observe(child)
        hideObserved[index] = true
      })
    },
    hideCallback(entries: IntersectionObserverEntry[]) {
      entries.forEach(entry => {
        const { target } = entry as any
        let hide = false
        if (!entry.isIntersecting) hide = true

        if (!target.__vue__) return
        target.__vue__.hide = hide
      })
    },
  },
})
</script>