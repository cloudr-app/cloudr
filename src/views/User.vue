<template>
  <div class="user">
    <section class="user-info">
      <user-info
        :name="userInfo.username"
        :avatar="userInfo.avatar"
        :description="userInfo.description"
      />
    </section>
    <section class="tracks" v-if="userTracks.length">
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
import Vue from "vue"
import TrackListItem from "@/components/TrackListItem.vue"
import InfiniteScroll from "@/components/functional/InfiniteScroll"
import UserInfo from "@/components/UserInfo.vue"
import Spinner from "@/components/Spinner.vue"

import player from "@/player"
// eslint-disable-next-line no-unused-vars
import { MusicSource, Track } from "@/player/musicSource"
import { toCloudrID } from "@/utils"
// eslint-disable-next-line no-unused-vars
import { State } from "@/types"

export default Vue.extend({
  name: "user",
  components: { TrackListItem, InfiniteScroll, UserInfo, Spinner },
  data: () => ({
    userInfo: {
      avatar: [],
      description: "loading",
      followerCount: 0,
      followsCount: 0,
      id: 0,
      likesCount: 0,
      playlistCount: 0,
      trackCount: 0,
      username: "loading",
    },
    userTracks: [],
    userNext: undefined,
  }),
  async created() {
    await this.loadUser(this.$route.params)
  },
  methods: {
    async loadUser(params: any) {
      const { platform, id } = params
      const plat = player(platform)

      await this.loadUserInfo({ plat, id })
      await this.loadUserTracks({ plat, id })

      const main = document.querySelector("main")
      if (main) main.scrollTop = 0
    },
    async loadUserInfo({ plat, id }: { plat: MusicSource; id: number }) {
      this.userInfo = await plat.user?.(id)
    },
    async loadUserTracks({ plat, id }: { plat: MusicSource; id: number }) {
      const tracks = await plat.userTracks?.(id)

      this.userTracks = tracks?.tracks
      this.userNext = tracks?.next
    },
    async playTrack(track: Track, index: number) {
      const { dispatch, commit } = this.$store
      const { userTracks } = this
      const { platform, id }: any = this.$route.params

      dispatch("playTrack", toCloudrID(track.platform, track.id))
      commit("setQueuePrev", userTracks.slice(0, index))
      commit("setQueue", userTracks.slice(index))
      commit("setPlayingList", toCloudrID(platform, id, "user"))
    },
    async loadNext() {
      if (!this.userNext) return

      const { commit, state } = this.$store as { state: State; commit: Function }
      const { tracks, next } = await this.userNext()

      this.userTracks = [...this.userTracks, ...tracks]
      this.userNext = next

      const { platform, id }: any = this.$route.params
      if (state.playingList === toCloudrID(platform, id))
        commit("setQueue", [...state.queue, ...tracks])
    },
  },
})
</script>

<style lang="stylus">
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