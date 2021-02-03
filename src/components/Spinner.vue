<template>
  <svg
    :width="75 * scale"
    :height="50 * scale"
    viewBox="0 0 300 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <path
        d="M237.5 200C272 200 300 172 300 137.5C300 104.5 274.375 77.75 241.875 75.5C233.375 32.375 195.5 0 150 0C113.875 0 82.625 20.5 67 50.5C29.375 54.5 0 86.25 0 125C0 166.375 33.625 200 75 200H237.5ZM77.125 175C51 175 27.75 155.875 25.25 129.875C22.375 100.125 45.75 75 75 75C99 75 119.125 92 123.875 114.625C125.125 120.625 130.125 125 136.125 125C143.75 125 150 118.125 148.5 110.625C143.125 82.625 122.125 60.25 94.875 52.75C108.625 34.5 131 23.125 156 25.25C192 28.375 218.625 60.5 218.625 96.625V100H235.75C253.875 100 270.625 112.125 274.125 130C279 153.875 260.625 175 237.5 175H77.125Z"
        id="logo"
      />
      <clipPath id="clip">
        <use xlink:href="#logo" />
      </clipPath>
    </defs>
    <use
      class="main-logo"
      href="#logo"
      stroke="var(--text-light)"
      stroke-width="15px"
      stroke-linecap="round"
      clip-path="url(#clip)"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    scale: {
      type: Number,
      default: 1,
    },
  },
})
</script>

<style lang="sass">
.main-logo
  stroke-dasharray: 900
  stroke-dashoffset: 900
  animation: stroke 1250ms linear infinite
  opacity: 1

@keyframes stroke
  0%
    opacity: 0
    stroke-dashoffset: 900

  25%
    opacity: 1

  75%
    stroke-dashoffset: 0
    opacity: 1

  100%
    stroke-dashoffset: 0
    opacity: 0
</style>
