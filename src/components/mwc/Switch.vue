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
import { defineComponent, ref, onMounted, onBeforeUnmount, toRefs, watch } from "vue"
import { MDCSwitch } from "@material/switch"

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: Boolean,
    },
  },
  setup(props) {
    const { label } = toRefs(props)
    const mdcSwitchRef = ref<HTMLElement | null>(null)

    let mdcSwitch: undefined | MDCSwitch

    const init = () => {
      if (!mdcSwitchRef.value) return
      mdcSwitch = new MDCSwitch(mdcSwitchRef.value)
    }

    const destroy = () => {
      if (mdcSwitch) mdcSwitch.destroy()
    }

    const reInit = () => {
      destroy()
      init()
    }

    onMounted(init)
    onBeforeUnmount(destroy)
    watch(label, reInit)

    return { mdcSwitchRef }
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
  padding: 13.2px 10px;
}
</style>