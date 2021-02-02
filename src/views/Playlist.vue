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
import { defineComponent, ref, computed } from "vue"
import { useRoute, RouteParams, onBeforeRouteUpdate } from "vue-router"

import artwork from "@/components/ArtworkInfo.vue"
import TrackListItem from "@/components/TrackListItem.vue"
import InfiniteScroll from "@/components/functional/InfiniteScroll"
import Spinner from "@/components/Spinner.vue"

import { getImageLargerThan, toCloudrID, PlatformAccessor } from "@/utils"

import player from "@/player"
import { MediaImage, Track, MusicSource } from "@/player/musicSource"
import { useStore } from "@/store/store"

declare global {
  interface Window {
    playlist: any
  }
}

export default defineComponent({
  name: "playlist",
  components: { artwork, TrackListItem, InfiniteScroll, Spinner },
  setup() {
    const route = useRoute()
    type PlaylistRouteParams = RouteParams & {
      platform: PlatformAccessor
      id: string
    }
    const params = route.params as PlaylistRouteParams

    const { state, commit, dispatch } = useStore()

    const playlistInfo = ref({
      artwork: [] as MediaImage[],
      id: 0,
      title: "loading",
      user: {
        username: "loading",
        id: 0,
      },
    })
    const playlistTracks = ref<Track[]>([])
    const playlistNext = ref()

    const likes = computed(() => route.name === "likes")

    const loadPlaylistInfo = async (plat: MusicSource, id: number) => {
      if (likes.value && plat.user) {
        const user = await plat.user(id)

        playlistInfo.value = {
          id: user.id,
          artwork: user.avatar,
          title: `${user.username}'s likes`,
          user,
        }
      } else playlistInfo.value = await plat.playlistInfo(id)
    }

    const loadPlaylistTracks = async (plat: MusicSource, id: number) => {
      let tracks

      if (likes.value && plat.likes) tracks = await plat.likes(id)
      else tracks = await plat.playlistTracks(id)

      playlistTracks.value = tracks.tracks
      playlistNext.value = tracks.next
    }

    const loadPlaylist = async (_params: PlaylistRouteParams) => {
      const { platform, id } = _params
      const plat = player(platform)

      await loadPlaylistInfo(plat, +id)
      await loadPlaylistTracks(plat, +id)

      const main = document.querySelector("main")
      if (main) main.scrollTop = 0
    }

    onBeforeRouteUpdate(async to => await loadPlaylist(to.params as PlaylistRouteParams))

    const loadNext = async () => {
      if (!playlistNext.value) return

      const { tracks, next } = await playlistNext.value()

      playlistTracks.value = [...playlistTracks.value, ...tracks]
      playlistNext.value = next

      const { platform, id } = params
      if (state.playingList === toCloudrID(platform, +id))
        commit("setQueue", [...state.queue, ...tracks])
    }

    const playTrack = async (track: Track, index: number) => {
      const { platform, id } = params

      dispatch("playTrack", toCloudrID(track.platform, track.id))
      commit("setQueuePrev", playlistTracks.value.slice(0, index))
      commit("setQueue", playlistTracks.value.slice(index))
      commit("setPlayingList", toCloudrID(platform, +id, "playlist"))
    }

    loadPlaylist(params)

    return {
      playlistInfo,
      playlistTracks,
      playlistNext,
      loadNext,
      playTrack,
      imgSrc: computed(() => {
        const images = playlistInfo.value.artwork as MediaImage[]
        if (!images?.length) return "/artwork-placeholder.svg"

        return getImageLargerThan(images, 500).src
      }),
    }
  },
})
</script>

<style lang="sass" scoped>
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