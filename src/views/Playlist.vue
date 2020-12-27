<template>
  <div class="playlist">
    <section class="playlist-info">
      <artwork
        :artwork="playlistInfo.artwork"
        :author="playlistInfo.user.username"
        :title="playlistInfo.title"
      />
    </section>
    <section class="tracks">
      <infinite-scroll :list="playlistTracks" root="main" @end="loadNext()">
        <track-list-item
          v-for="(track, index) in playlistTracks"
          :key="track.id"
          :track-info="track"
          @playTrack="playTrack(track, index)"
        />
      </infinite-scroll>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import artwork from "@/components/ArtworkInfo.vue"
import TrackListItem from "@/components/TrackListItem.vue"
import InfiniteScroll from "@/components/InfiniteScroll.vue"

import player from "@/player"
// eslint-disable-next-line no-unused-vars
import type { Playlist, Track } from "@/player/musicSource"

declare global {
  interface Window {
    playlist: any
  }
}

export default Vue.extend({
  name: "playlist",
  components: { artwork, TrackListItem, InfiniteScroll },
  data: (): { playlistInfo: Playlist; playlistTracks: any; playlistNext: any } => ({
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
    playlistTracks: [],
    playlistNext: undefined,
  }),
  async created() {
    window.playlist = this

    await this.loadPlaylist(this.$route.params)
  },
  async beforeRouteUpdate(to, from, next) {
    await this.loadPlaylist(to.params)
    next()
  },
  methods: {
    loadPlaylist(params: Object) {
      this.loadPlaylistInfo(params)
      this.loadPlaylistTracks(params)
    },
    async loadPlaylistInfo(params: Object) {
      const { platform, id }: any = params
      this.playlistInfo = await player(platform).playlistInfo(id)
    },
    async loadPlaylistTracks(params: Object) {
      const { platform, id }: any = params
      const { tracks, next } = await player(platform).playlistTracks(id)

      this.playlistTracks = tracks
      this.playlistNext = next
    },
    async loadNext() {
      if (!this.playlistNext) return

      const { commit, state } = this.$store as { state: State; commit: Function }
      const { tracks, next } = await this.playlistNext()

      this.playlistTracks = [...this.playlistTracks, ...tracks]
      this.playlistNext = next

      const { platform, id }: any = this.$route.params
      if (state.playingList === `${platform}:${id}`)
        commit("setQueue", [...state.queue, ...tracks])
    },
    async playTrack(track: Track, index: number) {
      const { dispatch, commit } = this.$store
      const { playlistTracks } = this
      const { platform, id }: any = this.$route.params

      await dispatch("playTrack", `${track.platform}:${track.id}`)
      commit("setPlayer", ["playing", true])
      commit("setQueuePrev", playlistTracks.slice(0, index))
      commit("setQueue", playlistTracks.slice(index))
      commit("setPlayingList", `${platform}:${id}`)
    },
  },
})
</script>

<style lang="stylus" scoped>
.playlist
  section.playlist-info
    width: 100%
    display: flex
    justify-content: center
    align-items: center

  section.tracks
    margin-top: 10px
</style>