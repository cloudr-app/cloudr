<template>
  <div class="preference" :class="[type]">
    <div class="main" @click="preferenceClick()">
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="description">{{ desc }}</div>
      </div>
      <div class="value">
        <mwc-switch
          v-if="typeof modelValue === 'boolean'"
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
        />
        <span v-else-if="isNumber">{{ valueDisplay }}</span>
      </div>
    </div>
    <dynamic-height-transition v-if="isNumber" :collapsed="collapsed">
      <div class="extra">
        <slider
          v-if="isNumber"
          immediate
          :value="modelValue"
          @input="$emit('update:modelValue', $event)"
        />
      </div>
    </dynamic-height-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed } from "vue"
import MwcSwitch from "@/components/mwc/Switch.vue"
import { pref } from "@/strings"
import { isObject } from "@/utils"
import Slider from "@/components/Slider.vue"
import DynamicHeightTransition from "@/components/functional/DynamicHeightTransition"

export default defineComponent({
  name: "preference",
  components: { MwcSwitch, Slider, DynamicHeightTransition },
  props: {
    preference: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Boolean, Number],
      required: true,
    },
  },
  setup(props) {
    const collapsed = ref(true)
    const { preference, modelValue } = toRefs(props)

    const name = computed(() => {
      const strings = pref[preference.value]

      if (strings) return strings.name
      return preference.value
    })

    const desc = computed(() => {
      const strings = pref[preference.value]

      if (!strings) return ""

      if (typeof strings.desc === "string") return strings.desc
      if (isObject(strings.desc)) return strings.desc?.[String(modelValue.value)] || ""

      return ""
    })

    const type = computed(() => {
      return typeof modelValue.value
    })

    const valueDisplay = computed(() => {
      const strings = pref[preference.value]
      return strings.translateValue?.(modelValue.value) || modelValue.value
    })

    const isNumber = computed(() => {
      return type.value === "number"
    })

    return {
      name,
      desc,
      type,
      valueDisplay,
      isNumber,
      collapsed,
      preferenceClick() {
        if (type.value === "number") collapsed.value = !collapsed.value
      },
    }
  },
})
</script>

<style lang="sass">
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
    padding: 0 15px
    display: flex
    align-items: center

    .slider
      margin-top: 5px
      margin-bottom: 10px
</style>
