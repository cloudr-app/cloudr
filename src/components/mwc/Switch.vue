<template>
  <div class="switch">
    <div
      class="mdc-switch"
      ref="mdcSwitchRef"
      :class="{ 'mdc-switch--checked': modelValue }"
    >
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb"></div>
        <input
          type="checkbox"
          class="mdc-switch__native-control"
          role="switch"
          :aria-checked="modelValue"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
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
    modelValue: {
      type: Boolean,
    },
  },
  setup(props) {
    const { label } = toRefs(props)
    const mdcSwitchRef = ref<HTMLElement | null>(null)

    let mdcSwitch: undefined | MDCSwitch

    const init = () => {
      if (!mdcSwitchRef.value) throw new Error("template ref not available at mount")
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
