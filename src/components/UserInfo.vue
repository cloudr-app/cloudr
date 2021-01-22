<template>
  <div class="user-info">
    <div
      class="avatar"
      @click="avatarExpanded = !avatarExpanded"
      :class="{ expanded: avatarExpanded }"
    >
      <img :src="imgSrc" alt="avatar not found" draggable="false" />
    </div>
    <div class="info">
      <div class="name">{{ name }}</div>
      <div
        class="description"
        @click="descriptionExpanded = !descriptionExpanded"
        :class="{ expanded: descriptionExpanded }"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { getImageLargerThan } from "@/utils"
// eslint-disable-next-line no-unused-vars
import { MediaImage } from "@/player/musicSource"

export default Vue.extend({
  data: () => ({
    descriptionExpanded: false,
    avatarExpanded: false,
  }),
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    avatar: {
      type: Array,
      required: true,
    },
  },
  computed: {
    imgSrc() {
      const images = this.avatar as MediaImage[]
      if (!images?.length) return "/artwork-placeholder.svg"

      return getImageLargerThan(images, 500).src
    },
  },
})
</script>

<style lang="stylus" scoped>
.user-info
  width: calc(100% - 20px)

  .avatar
    img
      width: 50%
      border-radius: 50%
      display: block
      margin: 0 auto
      transition: var(--transition-short) var(--ease)
      box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.333)

    &.expanded img
      border-radius: 0
      width: 100%

  .info
    margin-top: 0.5em
    font-size: 1.5rem
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column

    .name
      font-size: 1.5rem

    .description
      font-size: 0.75rem
      color: var(--text-m-light)
      max-width: 95%
      text-align: center
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical

      &.expanded
        -webkit-line-clamp: unset
</style>