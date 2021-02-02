import { computed, defineComponent, h, onMounted, ref, toRefs } from "vue"

export default defineComponent({
  render() {
    const { height } = this
    return h(
      "div",
      {
        ref: "wrap",
        class: "height-transition",
        style: {
          "max-height": `${height}px`,
        },
      },
      this.$slots.default
    )
  },
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const initialHeight = ref(0)
    const wrap = ref<HTMLElement | null>(null)
    const { collapsed } = toRefs(props)

    onMounted(() => {
      if (!wrap.value) return
      initialHeight.value = wrap.value.scrollHeight
    })

    return {
      height: computed(() => (collapsed ? 0 : initialHeight)),
    }
  },
})
