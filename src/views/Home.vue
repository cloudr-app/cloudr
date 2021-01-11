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
    <text-field label="test" v-model="text"></text-field>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
import TextField from "@/components/mwc/TextField.vue"
import Vue from "vue"

export default Vue.extend({
  components: { TextField },
  data: () => ({ text: "" }),
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