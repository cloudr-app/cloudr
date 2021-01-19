<template>
  <div class="preference" :class="[type]">
    <div class="main" @click="preferenceClick()">
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="description">{{ desc }}</div>
      </div>
      <div class="value">
        <mwc-switch
          v-if="typeof value === 'boolean'"
          :value="value"
          @input="$emit('input', $event)"
        />
        <span v-else-if="type === 'number'">{{ valueDisplay }}</span>
      </div>
    </div>
    <div class="extra" v-if="expanded">
      <slider v-if="type === 'number'" immediate :value="value" @input="$emit('input', $event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import MwcSwitch from "@/components/mwc/Switch.vue"
import { pref } from "@/strings"
import { isObject } from "@/utils"
import Slider from "@/components/Slider.vue"

export default Vue.extend({
  name: "preference",
  components: { MwcSwitch, Slider },
  data: () => ({
    expanded: false,
  }),
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
      if (isObject(strings.desc)) return strings.desc?.[this.value] || ""

      return ""
    },
    type() {
      return typeof this.value
    },
    valueDisplay() {
      const strings = pref[this.preference]
      return strings.translateValue?.(this.value) || this.value
    },
  },
  methods: {
    preferenceClick() {
      if (this.type === "number") this.expanded = !this.expanded
    },
  },
})
</script>

<style lang="stylus">
.preference
  // background: #f0f
  .main
    display: flex
    justify-content: space-between
    align-items: center
    min-height: 50px
    padding-left: 5px

    .info
      .name
        font-size: 1rem

      .description
        font-size: 0.75rem
        opacity: 0.75

  .extra
    padding: 5px 25px 0
    display: flex
    align-items: center
</style>