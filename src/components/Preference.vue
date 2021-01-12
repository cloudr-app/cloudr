<template>
  <div class="preference">
    <div class="left">
      <div class="name">{{ name }}</div>
      <div class="description">{{ desc }}</div>
    </div>
    <div class="right">
      <mwc-switch
        v-if="typeof value === 'boolean'"
        :value="value"
        @input="$emit('input', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import MwcSwitch from "@/components/mwc/Switch.vue"
import { pref } from "@/strings"
import { isObject } from "@/utils"

export default Vue.extend({
  name: "preference",
  components: { MwcSwitch },
  props: {
    preference: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Boolean, Number],
      required: true,
    },
  },
  computed: {
    name() {
      const strings = pref[this.preference]

      if (strings) return strings.name
      return this.preference
    },
    desc() {
      const strings = pref[this.preference]

      if (!strings) return ""

      if (typeof strings.desc === "string") return strings.desc
      if (isObject(strings.desc)) {
        const value = strings.desc[this.value]
        if (value) return value
      }

      return ""
    },
  },
})
</script>

<style lang="stylus">
.preference
  // background: #f0f
  display: flex
  justify-content: space-between
  align-items: center
  padding-left: 5px

  .left
    .name
      font-size: 1.1rem

    .description
      font-size: 0.75rem
      opacity: 0.75
</style>