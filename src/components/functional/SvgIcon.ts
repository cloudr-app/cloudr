import Vue from "vue"

export default Vue.extend({
  render(h) {
    return h(
      "svg",
      {
        class: "icon",
      },
      [
        h("use", {
          attrs: {
            "xlink:href": `#${this.icon}`,
          },
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
