<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/icon.svg" />
    <HelloWorld msg="Welcome to cloudr.app!" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
// eslint-disable-next-line no-inline-comments
import HelloWorld from "@/components/HelloWorld.vue" // @ is an alias to /src
import soundcloud from "../assets/soundcloud"

declare global {
  interface Window {
    soundcloud: any
  }
}

window.soundcloud = soundcloud

export default Vue.extend({
  name: "Home",
  components: {
    HelloWorld,
  },
})
</script>

<style lang="stylus">
.home > img
  max-width: 200px
</style>