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
      <router-link to="pl/td/13697bfa-35c6-46d2-a6b7-dc05c4dd8401">
        example 3 TIDAL playlist
      </router-link>

      <button @click="setTidalAccessToken">set tidal access_token</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ls } from "@/utils"
import Vue from "vue"

export default Vue.extend({
  name: "Home",
  methods: {
    setTidalAccessToken() {
      const access_token = prompt("enter access_token")

      if (access_token) ls("tidal-login", { access_token })
    },
  },
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