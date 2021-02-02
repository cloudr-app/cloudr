import { computed, defineComponent, h } from "vue"

import { useStore } from "@/store/store"

const squareBorders = {
  "--border-radius": "0",
  "--border-radius-large": "0",
  "--artwork-render-correction": "0px",
}

const lightTheme = {
  "--bg": "#e0e1eb",
  "--bg-dark": "#d0d2e2",
  "--accent": "#3b4386",
  "--text-white": "#000000",
  "--text-light": "#323237",
  "--text-m-light": "#a2a4b1",
  "--text-x-light": "#bbbdcb",
  "--text-trans-white": "0, 0, 0",
  "--text-highlight": "#0c003d",
  "--text-light-highlight": "#2a2a51",
  "--artwork-gradient": "rgba(201, 203, 221, 1)",
  "--small-artwork-highlight": "0 0 0 1px var(--text-white)",
}

const lightMonoTheme = {
  "--bg": "#e5e5e5",
  "--bg-dark": "#d9d9d9",
  "--accent": "#606060",
  "--text-white": "#000000",
  "--text-light": "#343434",
  "--text-m-light": "#a9a9a9",
  "--text-x-light": "#c3c3c3",
  "--text-trans-white": "0, 0, 0",
  "--text-highlight": "#1e1e1e",
  "--text-light-highlight": "#3d3d3d",
  "--artwork-gradient": "rgba(211, 211, 211, 1)",
  "--small-artwork-highlight": "0 0 0 1px var(--text-white)",
}

const darkMonoTheme = {
  "--bg": "#0d0d0d",
  "--bg-dark": "#121212",
  "--accent": "#9e9e9e",
  "--text-white": "#ffffff",
  "--text-light": "#cacaca",
  "--text-m-light": "#555555",
  "--text-x-light": "#3c3c3c",
  "--text-trans-white": "0, 0, 0",
  "--text-highlight": "#b3b3b3",
  "--text-light-highlight": "#c1c1c1",
  "--artwork-gradient": "rgba(44, 44, 44, 1)",
  "--small-artwork-highlight": "0 0 0 1px var(--text-white)",
}

export default defineComponent({
  render() {
    const { style } = this
    return h(
      "div",
      {
        class: "styles",
        style,
      },
      this.$slots.default?.()
    )
  },
  setup() {
    const { state } = useStore()

    return {
      style: computed(() => {
        const preferences = state.preferences
        let ret = {}

        if (!preferences.theme.roundBorders) ret = { ...ret, ...squareBorders }
        if (preferences.theme.monochromeTheme) {
          if (preferences.theme.darkTheme) ret = { ...ret, ...darkMonoTheme }
          else ret = { ...ret, ...lightMonoTheme }
        } else if (!preferences.theme.darkTheme) ret = { ...ret, ...lightTheme }

        return ret
      }),
    }
  },
})
