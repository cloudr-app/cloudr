<template>
  <div class="home">
    <img alt="cloudr.app logo" src="../assets/icon.svg" />
    <div class="examples">
      <router-link to="playlist/soundcloud/1162452736">
        example 1 soundcloud playlist
      </router-link>
      <router-link to="pl/sc/620756469">
        example 2 soundcloud playlist (short link)
      </router-link>
    </div>
    <mdc-text-field label="test" v-model="text" />
    <form action="">
      <mdc-switch v-model="checked" />
      <mdc-switch v-model="checked" />
      <label for="test1">test1</label>
      <mdc-checkbox label="test1" v-model="checked"></mdc-checkbox>
      <mdc-checkbox label="test2" disabled v-model="checked"></mdc-checkbox>
    </form>
  </div>
</template>

<script lang="ts">
import MdcTextField from "@/components/mwc/TextField.vue"
import MdcSwitch from "@/components/mwc/Switch.vue"
import MdcCheckbox from "@/components/mwc/Checkbox.vue"
import Vue from "vue"

export default Vue.extend({
  components: { MdcTextField, MdcSwitch, MdcCheckbox },
  data: () => ({ text: "", checked: true }),
  name: "Home",
})
</script>

<style lang="stylus" scoped>
.home
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  .examples
    margin: 64px 0

    a
      display: block
      font-size: 1rem
      margin: 8px 0

  img
    max-width: 200px
</style>