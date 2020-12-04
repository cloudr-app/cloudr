<template>
  <div class="player">
    <img
      src="https://i1.sndcdn.com/artworks-DDh4jzy9m6MApu7y-Nm7vWg-t500x500.jpg"
      alt="track art"
      class="artwork"
    />
    <div class="right">
      <div class="upper">
        <div class="track-info">
          <div class="title">Unspoken</div>
          <div class="author">En:vy</div>
        </div>
        <div class="spacer"></div>
        <div class="controls">
          <div class="skip-previous">
            <i class="mi">skip_previous</i>
          </div>
          <div class="play-pause">
            <i class="mi">play_arrow</i>
          </div>
          <div class="skip-next">
            <i class="mi">skip_next</i>
          </div>
        </div>
      </div>
      <div class="lower">
        <div class="scrubber">
          <div class="bar"></div>
          <div class="progress"></div>
          <div class="handle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "player",
})
</script>

<style lang="stylus" scoped>
.player
  --margins: 10px
  background: var(--bg-dark)
  width: 100%
  height: calc(var(--bottom-player-height) - var(--margins) * 2)
  display: flex
  padding: var(--margins)
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.5)

  img.artwork
    width: calc(var(--bottom-player-height) - var(--margins) * 2)
    border-radius: var(--border-radius)
    margin-right: var(--margins)

  .right
    flex-grow: 1
    display: flex
    flex-direction: column

    .upper
      display: flex

      .track-info
        margin-top: 4px
        font-size: 15px

        .title
          line-height: 1em
          font-size: 1em
          font-weight: 700

        .author
          line-height: 1.25em
          font-size: 0.85em

      .spacer
        flex-grow: 1

      .controls
        --controls-size: 42px
        height: var(--controls-size)
        display: flex
        margin-right: calc(var(--margins) * 2)

        > div
          height: var(--controls-size)

          i.mi
            font-size: var(--controls-size)
            line-height: 1ch

    .lower
      width: calc(100% - var(--margins) * 2)
      flex-grow: 1

      .scrubber
        --progress: 38%
        display: flex
        align-items: center
        height: 100%
        position: relative
        padding-bottom: 4px

        > *
          position: absolute

        .bar, .progress
          background: var(--text-x-light)
          width: 100%
          height: 4px
          border-radius: 2px

        .progress
          background: var(--text-light)
          width: var(--progress)

        .handle
          background: var(--text-white)
          height: 10px
          width: 10px
          border-radius: 50%
          left: calc(var(--progress) - 5px)
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25)
</style>