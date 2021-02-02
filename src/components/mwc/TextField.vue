<template>
  <label
    ref="textField"
    class="mdc-text-field mdc-text-field--outlined"
    :class="{ 'mdc-text-field--no-label': !label.length }"
  >
    <span ref="notchedOutline" class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch" v-if="label.length">
        <span class="mdc-floating-label" id="my-label-id">{{ label }}</span>
      </span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      type="text"
      class="mdc-text-field__input"
      aria-labelledby="my-label-id"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, watch, onBeforeUnmount } from "vue"
import { MDCTextField } from "@material/textfield"
import { MDCNotchedOutline } from "@material/notched-outline"

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {},
  },
  setup(props) {
    const { label } = toRefs(props)

    const textFieldRef = ref<HTMLElement | null>(null)
    const notchedOutlineRef = ref<HTMLElement | null>(null)

    let textField: undefined | MDCTextField
    let notchedOutline: undefined | MDCNotchedOutline

    const init = () => {
      if (!textFieldRef.value || !notchedOutlineRef.value) return

      textField = new MDCTextField(textFieldRef.value)
      notchedOutline = new MDCNotchedOutline(notchedOutlineRef.value)
    }

    const destroy = () => {
      if (textField) textField.destroy()
      if (notchedOutline) notchedOutline.destroy()
    }

    const reInit = () => {
      destroy()
      init()
    }

    onMounted(init)
    watch(label, reInit)
    onBeforeUnmount(destroy)

    return {
      textFieldRef,
      notchedOutlineRef,
    }
  },
})
</script>

<style lang="scss">
@use "@material/floating-label/mdc-floating-label";
@use "@material/notched-outline/mdc-notched-outline";
@use "@material/textfield";

@include textfield.core-styles;

.mdc-text-field--outlined:not(.mdc-text-field--disabled) {
  .mdc-notched-outline__leading,
  .mdc-notched-outline__notch,
  .mdc-notched-outline__trailing {
    border-color: var(--mdc-text-field);
  }
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover
  .mdc-notched-outline {
  .mdc-notched-outline__leading,
  .mdc-notched-outline__notch,
  .mdc-notched-outline__trailing {
    border-color: var(--mdc-text-field-hover, var(--mdc-theme-primary));
  }
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mdc-text-field);
}

.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mdc-text-field-focus, var(--mdc-theme-primary));
}

span.mdc-notched-outline > span {
  transition: 200ms;
}

.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mdc-theme-primary);
}

input.mdc-text-field__input {
  font-family: var(--mdc-typography-font-family);
}
</style>