<template>
  <div class="user">
    <section class="user-info">
      <user-info
        :name="userInfo.username"
        :avatar="userInfo.avatar"
        :description="userInfo.description"
      />
    </section>
    <section class="tracks">
      <infinite-scroll :list="userTracks" root="main" @end="loadNext()">
        <track-list-item
          v-for="(track, index) in userTracks"
          :key="track.platform + track.id"
          :track-info="track"
          @playTrack="playTrack(track, index)"
        />
      </infinite-scroll>
      <div class="spinner" v-if="userNext">
        <spinner :scale="0.5" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import TrackListItem from "@/components/TrackListItem.vue"
import InfiniteScroll from "@/components/functional/InfiniteScroll"
import UserInfo from "@/components/UserInfo.vue"
import Spinner from "@/components/Spinner.vue"

import player from "@/player"
import { MusicSource, Track, MediaImage } from "@/player/musicSource"
import { toCloudrID, PlatformAccessor } from "@/utils"
import { useStore } from "@/store/store"
import { RouteParams, useRoute } from "vue-router"

// TODO move some of this stuff out into reusable stuff for playlists
// ? or
// TODO make this one component with playlist

export default defineComponent({
  name: "user",
  components: { TrackListItem, InfiniteScroll, UserInfo, Spinner },
  async setup() {
    const route = useRoute()
    type PlaylistRouteParams = RouteParams & {
      platform: PlatformAccessor
      id: string
    }
    const params = route.params as PlaylistRouteParams

    const { state, commit, dispatch } = useStore()

    const userInfo = ref({
      avatar: [] as MediaImage[],
      description: "loading" as string | null,
      // followerCount: 0,
      // followsCount: 0,
      // likesCount: 0,
      // playlistCount: 0,
      // trackCount: 0,
      id: 0,
      username: "loading",
    })
    const userTracks = ref<Track[]>([])
    const userNext = ref()

    const loadUserInfo = async (plat: MusicSource, id: number) => {
      const info = await plat.user?.(id)
      if (!info) return
      userInfo.value = info
    }

    const loadUserTracks = async (plat: MusicSource, id: number) => {
      const tracks = await plat.userTracks?.(id)

      if (tracks) userTracks.value = tracks.tracks
      userNext.value = tracks?.next
    }

    const loadUser = async (_params: PlaylistRouteParams) => {
      const { platform, id } = _params
      const plat = player(platform)

      await loadUserInfo(plat, +id)
      await loadUserTracks(plat, +id)

      const main = document.querySelector("main")
      if (main) main.scrollTop = 0
    }

    const playTrack = async (track: Track, index: number) => {
      const { platform, id } = params

      dispatch("playTrack", toCloudrID(track.platform, track.id))
      commit("setQueuePrev", userTracks.value.slice(0, index))
      commit("setQueue", userTracks.value.slice(index))
      commit("setPlayingList", toCloudrID(platform, +id, "playlist"))
    }

    const loadNext = async () => {
      if (!userNext.value) return

      const { tracks, next } = await userNext.value()

      userTracks.value = [...userTracks.value, ...tracks]
      userNext.value = next

      const { platform, id }: any = route.params
      if (state.playingList === toCloudrID(platform, id))
        commit("setQueue", [...state.queue, ...tracks])
    }

    await loadUser(params)

    return {
      playTrack,
      userInfo,
      userTracks,
      userNext,
      loadNext,
    }
  },
})
</script>

<style lang="sass">
.user
  padding-top: 10px

  section.user-info
    display: flex
    justify-content: center
    align-items: center
    margin-bottom: 1em

  .spinner
    display: flex
    justify-content: center
    align-items: center
    padding: 2em 0
    opacity: 0.5
</style>