import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
  watch,
} from "vue"

export default defineComponent({
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
  setup(props, { slots, emit }) {
    const wrap = ref<Element | null>(null)
    const { root, list } = toRefs(props)

    let endObserver: IntersectionObserver
    let observed: Element | undefined

    let hideObserver: IntersectionObserver
    const hideObserved: boolean[] = []

    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) emit("end")
      })
    }
    const assignHideObservers = () => {
      const children = wrap.value?.children
      const slotChildren = slots.default?.()?.[0].children

      if (!slotChildren || children?.length !== slotChildren.length)
        throw new Error("children length and slot content length are not the same.")
      if (!children) throw new Error("no direct children found")

      const childArray = [...children]
      childArray.forEach((child, index) => {
        if (hideObserved[index]) return

        hideObserver.observe(child)
        hideObserved[index] = true
      })
    }
    const hideCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const { target } = entry as any
        let hide = false
        if (!entry.isIntersecting) hide = true

        if (!target?.__vueParentComponent?.props) return
        target.__vueParentComponent.props.hide = hide
      })
    }

    onMounted(() => {
      endObserver = new IntersectionObserver(intersectionCallback, {
        root: document.querySelector(root.value),
        rootMargin: "0px 0px 1000px 0px",
      })
      hideObserver = new IntersectionObserver(hideCallback, {
        root: document.querySelector(root.value),
        rootMargin: "108px 0px 500px 0px",
      })
    })

    onBeforeUnmount(() => endObserver.disconnect())

    watch(list, async () => {
      if (observed) endObserver.unobserve(observed)

      await nextTick()
      assignHideObservers()

      const children = wrap.value?.children
      observed = children?.[children?.length - 1]
      if (observed) endObserver.observe(observed)
    })

    return () =>
      h(
        "div",
        {
          class: "infinite-scroll",
          ref: wrap,
        },
        slots.default?.()
      )
  },
})
