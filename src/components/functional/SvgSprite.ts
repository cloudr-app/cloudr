import { defineComponent, h } from "vue"

const svgContext = require.context(
  "!svg-inline-loader?" +
    "removeTags=true" +
    "&removeSVGTagAttrs=true" +
    "&removingTagAttrs=fill" +
    "!@/assets/icons",
  true,
  /\w+\.svg$/i
)

const symbols = svgContext.keys().map(path => {
  const content = svgContext(path)
  const id = path.replace(/^\.\/(.*)\.\w+$/, "$1")
  return content.replace("<svg", `<symbol id="${id}"`).replace("svg>", "symbol>")
})

export default defineComponent({
  render() {
    return h("svg", {
      width: "0",
      height: "0",
      innerHTML: this.$options.svgSprite,
      style: {
        display: "none",
      },
    })
  },
  svgSprite: symbols.join("\n"),
})
