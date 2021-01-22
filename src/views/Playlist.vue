<template>
  <div class="playlist">
    <section class="playlist-info">
      <artwork
        :artwork="imgSrc"
        :author="playlistInfo.user.username"
        :title="playlistInfo.title"
      />
    </section>
    <section class="tracks">
      <infinite-scroll :list="playlistTracks" root="main" @end="loadNext()">
        <track-list-item
          v-for="(track, index) in playlistTracks"
          :key="track.platform + track.id"
          :track-info="track"
          @playTrack="playTrack(track, index)"
        />
      </infinite-scroll>
      <div class="spinner" v-if="playlistNext">
        <spinner :scale="0.5" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import artwork from "@/components/ArtworkInfo.vue"
import TrackListItem from "@/components/TrackListItem.vue"
import InfiniteScroll from "@/components/functional/InfiniteScroll"

import { getImageLargerThan, toCloudrID } from "@/utils"

import player from "@/player"
// eslint-disable-next-line no-unused-vars
import { MediaImage, Track } from "@/player/musicSource"
// eslint-disable-next-line no-unused-vars
import { State } from "@/types"
import Spinner from "@/components/Spinner.vue"

declare global {
  interface Window {
    playlist: any
  }
}

export default Vue.extend({
  name: "playlist",
  components: { artwork, TrackListItem, InfiniteScroll, Spinner },
  data: () => ({
    playlistInfo: {
      artwork: [],
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
  computed: {
    imgSrc() {
      const images = this.playlistInfo.artwork as MediaImage[]
      if (!images.length) return "/artwork-placeholder.svg"

      return getImageLargerThan(images, 500).src
    },
    likes() {
      return this.$route.name === "Likes"
    },
  },
  async created() {
    window.playlist = this

    await this.loadPlaylist(this.$route.params)
  },
  async beforeRouteUpdate(to, _, next) {
    await this.loadPlaylist(to.params)
    next()
  },
  methods: {
    async loadPlaylist(params: Object) {
      await this.loadPlaylistInfo(params)
      await this.loadPlaylistTracks(params)

      const main = document.querySelector("main")
      if (main) main.scrollTop = 0
    },
    async loadPlaylistInfo(params: Object) {
      const { platform, id }: any = params
      const plat = player(platform)

      if (this.likes && plat.user) {
        const user = await plat.user(id)

        this.playlistInfo = {
          platform: user.platform,
          id: user.id,
          artwork: user.avatar,
          title: `${user.username}'s likes`,
          trackCount: user.likesCount,
          user,
          description: user.description,
        }
      } else this.playlistInfo = await plat.playlistInfo(id)
    },
    async loadPlaylistTracks(params: Object) {
      const { platform, id }: any = params
      const plat = player(platform)
      let tracks

      if (this.likes && plat.likes) tracks = await plat.likes(id)
      else tracks = await plat.playlistTracks(id)

      this.playlistTracks = tracks.tracks
      this.playlistNext = tracks.next
    },
    async loadNext() {
      if (!this.playlistNext) return

      const { commit, state } = this.$store as { state: State; commit: Function }
      const { tracks, next } = await this.playlistNext()

      this.playlistTracks = [...this.playlistTracks, ...tracks]
      this.playlistNext = next

      const { platform, id }: any = this.$route.params
      if (state.playingList === toCloudrID(platform, id))
        commit("setQueue", [...state.queue, ...tracks])
    },
    async playTrack(track: Track, index: number) {
      const { dispatch, commit } = this.$store
      const { playlistTracks } = this
      const { platform, id }: any = this.$route.params

      await dispatch("playTrack", toCloudrID(track.platform, track.id))
      commit("setQueuePrev", playlistTracks.slice(0, index))
      commit("setQueue", playlistTracks.slice(index))
      commit("setPlayingList", toCloudrID(platform, id))
    },
  },
})
</script>

<style lang="stylus" scoped>
.playlist
  padding-top: 10px

  section.playlist-info
    width: 100%
    display: flex
    justify-content: center
    align-items: center

  section.tracks
    margin-top: 10px

    .spinner
      display: flex
      justify-content: center
      align-items: center
      padding: 2em 0
      opacity: 0.5
</style>