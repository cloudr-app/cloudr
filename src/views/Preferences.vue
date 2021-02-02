<template>
  <div class="preferences">
    <template v-for="(val, preference) in preferences">
      <div v-if="isObject(val)" :key="preference + 'isObject'" class="category">
        <span>{{ preference }}</span>
        <preference
          v-for="(subVal, subPreference) in val"
          :key="subPreference"
          :preference="subPreference"
          :value="subVal"
          @input="handleChange($event, preference, String(subPreference))"
        />
      </div>

      <preference
        v-else
        :key="preference"
        :preference="preference"
        :value="val"
        @input="handleChange($event, preference)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Preference from "@/components/Preference.vue"
import { isObject } from "@/utils"
import { SettingsValue } from "@/types"
import { useStore } from "@/store/store"

export default defineComponent({
  name: "preferences",
  components: { Preference },
  setup() {
    const { state, dispatch } = useStore()

    const handleChange = (value: SettingsValue, pref: string, sub?: string) =>
      dispatch("pref", [value, pref, sub])

    return {
      isObject,
      handleChange,
      preferences: state.preferences,
    }
  },
})
</script>

<style lang="sass">
.preferences
  padding: 0 15px

  .category
    margin-bottom: 10px

    > span
      font-size: 0.75rem
      opacity: 0.5
</style>