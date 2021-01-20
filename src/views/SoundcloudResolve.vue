<template>
  <div class="soundcloud-resolve">
    <span> Resolving SoundCloud url...</span>
  </div>
</template>

<script lang="ts">
import player from "@/player"
import Vue from "vue"

const soundcloud = player("soundcloud")

export default Vue.extend({
  name: "soundcloud-resolve",
  async created() {
    try {
      const resolved = await soundcloud.resolve?.(this.$route.path)
      this.$router.replace(resolved)
    } catch (err) {
      console.log("resolve error", err)
      this.$router.replace("/")
    }
  },
})
</script>

<style lang="stylus">
.soundcloud-resolve
  height: 100%
  display: flex
  justify-content: center
  align-items: center
</style>