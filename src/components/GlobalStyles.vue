<template>
  <div class="styles" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

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
  "--text-trans-white": "#000000",
  "--text-highlight": "#0c003d",
  "--text-light-highlight": "#2a2a51",
  "--artwork-gradient": "rgba(201, 203, 221, 1)",
  "--small-artwork-highlight": "0 0 0 1px var(--text-white)",
}

export default Vue.extend({
  name: "global-styles",
  computed: {
    style() {
      const { preferences } = this.$store.state
      let ret = {}

      if (!preferences.roundBorders) ret = { ...ret, ...squareBorders }
      if (!preferences.darkTheme) ret = { ...ret, ...lightTheme }

      return ret
    },
  },
})
</script>