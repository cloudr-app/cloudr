import { defineComponent, h } from "vue"

// TODO: forward click event

export default defineComponent({
  name: "svg-icon",
  render() {
    return h(
      "svg",
      {
        class: "icon",
      },
      [
        h("use", {
          "xlink:href": `#${this.icon}`,
        }),
      ]
    )
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
})
