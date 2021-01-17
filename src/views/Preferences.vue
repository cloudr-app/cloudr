<template>
  <div class="preferences">
    <template v-for="(val, preference) in preferences">
      <div v-if="isObject(val)" :key="preference" class="category">
        <span>{{ preference }}</span>
        <preference
          v-for="(subVal, subPreference) in val"
          :key="subPreference"
          :preference="subPreference"
          :value="subVal"
          @input="handleChange($event, preference, subPreference)"
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
import Vue from "vue"
import Preference from "@/components/Preference.vue"
import { isObject } from "@/utils"

export default Vue.extend({
  name: "preferences",
  components: { Preference },
  mounted() {
    const pref = JSON.parse(JSON.stringify(this.$store.state.preferences))
    console.log(pref)
  },
  computed: {
    preferences() {
      return this.$store.state.preferences
    },
  },
  methods: {
    isObject,
    handleChange(value: SettingsValue, pref: string, sub: string) {
      const { dispatch } = this.$store

      dispatch("pref", [value, pref, sub])
    },
  },
})
</script>

<style lang="stylus">
.preferences
  padding: 0 15px

  .category
    margin: 10px 0

    > span
      font-size: 0.75rem
      opacity: 0.5
</style>