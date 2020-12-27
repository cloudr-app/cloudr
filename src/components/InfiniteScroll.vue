<template>
  <div class="infinite-scroll" ref="wrap">
    <slot></slot>
  </div>
</template>

<script lang="ts">
let observer: IntersectionObserver
let observed: HTMLElement

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
    observer = new IntersectionObserver(this.intersectionCallback, {
      root: document.querySelector(this.root),
    })
  },
  beforeDestroy() {
    observer.disconnect()
  },
  watch: {
    async list() {
      if (observed) observer.unobserve(observed)

      await this.$nextTick()

      const children = this.$refs.wrap.children
      observed = children[children.length - 11]
      observer.observe(observed)
    },
  },
  methods: {
    intersectionCallback(entries: IntersectionObserverEntry[]) {
      const self = this
      entries.forEach(entry => {
        if (entry.isIntersecting) self.$emit("end")
      })
    },
  },
})
</script>