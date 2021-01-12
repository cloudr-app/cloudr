<template>
  <div class="mdc-form-field" ref="mdcFormField">
    <div
      class="mdc-checkbox mdc-checkbox--touch"
      ref="mdcCheckbox"
      :class="{ 'mdc-checkbox--disabled': disabled }"
    >
      <input
        type="checkbox"
        class="mdc-checkbox__native-control"
        :id="label"
        :aria-checked="value"
        :checked="value"
        @change="$emit('input', $event.target.checked)"
        :disabled="disabled"
      />
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path
            class="mdc-checkbox__checkmark-path"
            fill="none"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
          />
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
      <div class="mdc-checkbox__ripple"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { MDCFormField } from "@material/form-field"
import { MDCCheckbox } from "@material/checkbox"

let mdcCheckbox: undefined | MDCCheckbox
let mdcFormField: undefined | MDCFormField

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      mdcCheckbox = new MDCCheckbox(this.$refs.mdcCheckbox)
      mdcFormField = new MDCFormField(this.$refs.mdcFormField)
      mdcFormField.input = mdcCheckbox
    },
    destroy() {
      if (mdcCheckbox) mdcCheckbox.destroy()
      if (mdcFormField) mdcFormField.destroy()
    },
  },
})
</script>

<style lang="scss">
@use "@material/checkbox";
@use "@material/form-field";

@include checkbox.core-styles;
@include form-field.core-styles;

// todo: fix checkbox background transition to disabled

.mdc-checkbox {
  --mdc-ripple-hover-opacity: 0;
  --mdc-ripple-focus-opacity: 0;
}
.mdc-checkbox__background {
  --mdc-checkbox-unchecked-color: var(--mdc-text-field);
  --mdc-checkbox-disabled-color: var(--mdc-text-field-fill);
}
</style>