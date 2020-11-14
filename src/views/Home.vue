<template>
  <div class="home">
    <img alt="cloudr.app logo" src="../assets/icon.svg" />
    <div class="examples">
      <router-link to="playlist/soundcloud/1162452736">
        example 1 soundcloud playlist
      </router-link>
      <router-link to="pl/sc/645355878">
        example 2 soundcloud playlist (short link)
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
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

  img
    max-width: 200px
</style>