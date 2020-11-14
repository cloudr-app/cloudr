<template>
  <nav class="top">
    <div class="left">
      <i class="mi" @click="$router.back()" v-if="$route.fullPath !== '/'">arrow_back</i>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "top-nav",
})
</script>

<style lang="stylus" scoped>
nav.top
  height: var(--nav-height)

  > .left > i.mi
    font-size: 28px
    margin: 14px
    cursor: pointer
</style>