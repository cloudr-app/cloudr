<template>
  <div class="track">
    <div class="main">
      <div class="artwork">
        <img :src="trackInfo.artwork" alt="" />
      </div>
      <div class="info">
        <div class="title">{{ trackInfo.title }}</div>
        <div class="author">{{ trackInfo.user.username }}</div>
      </div>
      <div class="actions">
        <!-- <div class="quick-action">
          <i class="mi">queue</i>
        </div> -->
        <div class="options">
          <i class="mi">more_vert</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "track-list-item",
  props: {
    trackInfo: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="stylus" scoped>
.track
  padding: 0 12.5px

  .main
    height: 54px
    display: flex
    align-items: center

    .actions
      margin-left: auto
      display: flex

      > div
        height: 100%
        display: flex
        align-items: center
        cursor: pointer

        > i
          margin-left: 12px

    .info
      max-width: calc(100% - 50px - 36px)

      .title, .author
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 1
        -webkit-box-orient: vertical

      .title
        color: var(--text-white)
        font-size: 14px
        font-weight: 500
        font-variation-settings: "wght" 500

      .author
        font-size: 12px
        font-weight: 400
        font-variation-settings: "wght" 400

    .artwork
      height: 40px
      width: 40px
      overflow: hidden
      border-radius: var(--border-radius)
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)
      margin-right: 10px

      img
        height: 100%
</style>