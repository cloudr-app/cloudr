import { defineComponent, h } from "vue"

let endObserver: IntersectionObserver
let observed: Element

let hideObserver: IntersectionObserver
const hideObserved: boolean[] = []

export default defineComponent({
  render() {
    return h(
      "div",
      {
        class: "infinite-scroll",
        ref: "wrap",
      },
      this.$slots.default?.()
    )
  },
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
  mounted() {
    endObserver = new IntersectionObserver(this.intersectionCallback, {
      root: document.querySelector(this.root),
      rootMargin: "0px 0px 1000px 0px",
    })
    hideObserver = new IntersectionObserver(this.hideCallback, {
      root: document.querySelector(this.root),
      rootMargin: "108px 0px 500px 0px",
    })
  },
  beforeUnmount() {
    endObserver.disconnect()
  },
  watch: {
    async list() {
      if (observed) endObserver.unobserve(observed)

      await this.$nextTick()
      // this.assignHideObservers()

      const wrap = this.$refs.wrap as HTMLElement
      const children = wrap.children
      observed = children[children.length - 1]
      if (observed) endObserver.observe(observed)
    },
  },
  methods: {
    intersectionCallback(entries: IntersectionObserverEntry[]) {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.$emit("end")
      })
    },
    assignHideObservers() {
      const wrap = this.$refs.wrap as HTMLElement
      const children = wrap.children
      const slotChildren = this.$slots.default?.()

      if (!slotChildren || children.length !== slotChildren.length)
        throw new Error("children length and slot content length are not the same.")

      const childArray = [...children]
      childArray.forEach((child, index) => {
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
