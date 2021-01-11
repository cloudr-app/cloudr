<template>
  <div class="switch">
    <div class="mdc-switch" ref="mdcSwitch" :class="{ 'mdc-switch--checked': value }">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb"></div>
        <input
          type="checkbox"
          class="mdc-switch__native-control"
          role="switch"
          :aria-checked="value"
          :checked="value"
          @change="$emit('input', $event.target.checked)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { MDCSwitch } from "@material/switch"

let mdcSwitch: undefined | MDCSwitch

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: Boolean,
    },
  },
  watch: {
    label: "reInit",
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    reInit() {
      this.destroy()
      this.init()
    },
    init() {
      mdcSwitch = new MDCSwitch(this.$refs.mdcSwitch)
    },
    destroy() {
      if (mdcSwitch) mdcSwitch.destroy()
    },
  },
})
</script>

<style lang="scss">
@use "@material/switch";

@include switch.core-styles;

.mdc-switch {
  --mdc-ripple-hover-opacity: 0;
  --mdc-ripple-focus-opacity: 0;
}

.switch {
  padding: 13.2px 14px;
}
</style>