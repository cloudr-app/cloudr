<template>
  <div class="soundcloud-resolve">
    <spinner />
    <span>Resolving SoundCloud url...</span>
  </div>
</template>

<script lang="ts">
import player from "@/player"
import Spinner from "@/components/Spinner.vue"
import Vue from "vue"

const soundcloud = player("soundcloud")

export default Vue.extend({
  components: { Spinner },
  name: "soundcloud-resolve",
  async created() {
    try {
      const resolved = await soundcloud.resolve?.(this.$route.path)
      if (!resolved) return this.$router.replace("/")
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
  flex-direction: column
  justify-content: center
  align-items: center

  > span
    margin-top: 1em
</style>