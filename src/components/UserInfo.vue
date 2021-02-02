<template>
  <div class="user-info">
    <div class="avatar" @click="expand" :class="{ expanded }">
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
import { defineComponent, ref, PropType, computed, toRefs } from "vue"

import { getImageLargerThan } from "@/utils"
import { MediaImage } from "@/player/musicSource"

export default defineComponent({
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
      type: Array as PropType<MediaImage[]>,
      required: true,
    },
  },
  setup(props) {
    const descriptionExpanded = ref(false)
    const expanded = ref(false)
    const { avatar } = toRefs(props)

    const outsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(".avatar")) return
      expanded.value = false

      window.removeEventListener("pointerdown", outsideClick)
    }

    const expand = () => {
      expanded.value = !expanded.value

      if (expanded.value) window.addEventListener("pointerdown", outsideClick, false)
      else window.removeEventListener("pointerdown", outsideClick)
    }

    return {
      descriptionExpanded,
      expanded,
      expand,
      imgSrc: computed(() => {
        const images = avatar.value
        if (!images?.length) return "/artwork-placeholder.svg"

        return getImageLargerThan(images, 500).src
      }),
    }
  },
})
</script>

<style lang="sass" scoped>
.user-info
  width: calc(100% - 20px)

  .avatar
    margin-bottom: 0.5em

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