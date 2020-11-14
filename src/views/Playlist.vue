<template>
  <div class="playlist">
    <section class="playlist-info">
      <artwork
        :artwork="playlistInfo.artwork"
        :author="playlistInfo.user.username"
        :title="playlistInfo.title"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import artwork from "@/components/Artwork.vue"

import player from "@/player"
// eslint-disable-next-line no-unused-vars
import type { Playlist } from "@/player/musicSource"

declare global {
  interface Window {
    playlist: any
  }
}

export default Vue.extend({
  name: "playlist",
  components: { artwork },
  data: (): { playlistInfo: Playlist } => ({
    playlistInfo: {
      artwork: "/artwork-placeholder.svg",
      id: 0,
      platform: "soundcloud",
      title: "loading",
      user: {
        platform: "soundcloud",
        username: "loading",
        id: 0,
      },
      trackCount: 0,
    },
  }),
  async created() {
    window.playlist = this

    await this.loadPlaylistInfo(this.$route.params)
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadPlaylistInfo(to.params)
    next()
  },
  methods: {
    async loadPlaylistInfo(params: Object) {
      const { platform, id }: any = params
      this.playlistInfo = await player(platform).playlistInfo(id)
    },
  },
})
</script>

<style lang="stylus" scoped>
.playlist
  .playlist-info
    width: 100%
    display: flex
    justify-content: center
    align-items: center
</style>