import { computed, defineComponent, h, onMounted, ref, toRefs } from "vue"

export default defineComponent({
  name: "dynamic-height-transition",
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
      this.$slots.default?.()
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
      if (!wrap.value) throw new Error("template ref not available at mount")
      initialHeight.value = wrap.value.scrollHeight
    })

    return {
      wrap,
      height: computed(() => (collapsed.value ? 0 : initialHeight.value)),
    }
  },
})
