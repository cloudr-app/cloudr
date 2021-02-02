<template>
  <div class="soundcloud-resolve">
    <spinner />
    <span>Resolving SoundCloud url...</span>
  </div>
</template>

<script lang="ts">
import player from "@/player"
import Spinner from "@/components/Spinner.vue"
import { defineComponent } from "vue"
import { useRouter, useRoute } from "vue-router"

const soundcloud = player("soundcloud")

export default defineComponent({
  components: { Spinner },
  name: "soundcloud-resolve",
  async setup() {
    const router = useRouter()
    const route = useRoute()

    try {
      const resolved = await soundcloud.resolve?.(route.path)
      if (!resolved) return router.replace("/")
      router.replace(resolved)
    } catch (err) {
      console.log("resolve error", err)
      router.replace("/")
    }
  },
})
</script>

<style lang="sass">
.soundcloud-resolve
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

  > span
    margin-top: 1em
</style>