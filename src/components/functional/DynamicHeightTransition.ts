import Vue from "vue"

export default Vue.extend({
  render(h) {
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
  data: () => ({
    initialHeight: 0,
  }),
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    this.initialHeight = this.$refs.wrap.scrollHeight
  },
  computed: {
    height() {
      return this.collapsed ? 0 : this.initialHeight
    },
  },
})
