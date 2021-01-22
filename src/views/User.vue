<template>
  <div class="user">
    <section class="user-info">
      <user-info
        :name="userInfo.username"
        :avatar="userInfo.avatar"
        :description="userInfo.description"
      />
    </section>
    <!-- <section class="tracks">
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
    </section> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
// import TrackListItem from "@/components/TrackListItem.vue"
// import InfiniteScroll from "@/components/functional/InfiniteScroll"
import UserInfo from "@/components/UserInfo.vue"

import player from "@/player"

export default Vue.extend({
  name: "user",
  // components: { TrackListItem, InfiniteScroll, UserInfo },
  components: { UserInfo },
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
    async loadUserInfo({ plat, id }: any) {
      this.userInfo = await plat.user(id)
    },
    async loadUserTracks() {},
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
</style>