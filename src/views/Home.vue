<template>
  <div class="home">
    <img alt="cloudr.app logo" src="../assets/icon.svg" width="200" height="200" />
    <div class="examples">
      <h2>examples</h2>
      <router-link to="/soundcloud/playlist/1162452736">
        soundcloud playlist
      </router-link>
      <router-link to="/vaaski/likes"> soundcloud likes (resolve link) </router-link>
      <router-link to="/noisia"> soundcloud user (resolve link) </router-link>
      <router-link to="/td/pl/13697bfa-35c6-46d2-a6b7-dc05c4dd8401">
        TIDAL playlist
      </router-link>
      <router-link to="/tidal/playlist/f3338b1a-5eec-4582-80a7-bcfd677f65f1">
        TIDAL playlist (gapless playback test)
      </router-link>

      <button @click="setTidalAccessToken">set tidal access_token</button>
    </div>
    <div class="search-params" v-if="params.length">
      params:
      <div class="param" v-for="[key, value] in params" :key="key + value">
        {{ key }}: {{ value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"

import { ls } from "@/utils"

export default defineComponent({
  name: "Home",
  setup() {
    const params = ref([[""]])

    onMounted(() => {
      const { searchParams } = new URL(window.location.href)
      params.value = [...searchParams.entries()]
    })

    const setTidalAccessToken = () => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const access_token = prompt("enter access_token")

      // eslint-disable-next-line @typescript-eslint/camelcase
      if (access_token) ls("tidal-login", { access_token })
    }

    return { params, setTidalAccessToken }
  },
})
</script>

<style lang="sass" scoped>
.home
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  .slider-test
    width: 90%

  .examples
    margin: 64px 0

    a
      display: block
      font-size: 1rem
      margin: 8px 0

  img
    max-width: 200px
</style>
