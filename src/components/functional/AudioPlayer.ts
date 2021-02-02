import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue"

import notification from "@/player/notification"

import { useStore } from "@/store/store"

function throttle(func: Function, limit: number): () => any {
  let inThrottle: boolean
  return function t(...args: any[]): any {
    const context = args[0] as any
    if (!inThrottle) {
      inThrottle = true
      func.apply(context, args)
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

const playingEl = document.createElement("audio")
// @ts-expect-error
window.playingEl = playingEl

const nextEl = document.createElement("audio")
// @ts-expect-error
window.nextEl = nextEl

for (const el of [playingEl, nextEl]) {
  el.preload = "auto"
  el.autoplay = true
}

export default defineComponent({
  setup() {
    const { commit, dispatch, state } = useStore()

    const lastPlaybackState = ref(false)

    const updateDuration = throttle(() => {
      if (!isNaN(playingEl.duration) && state.player.duration !== playingEl.duration)
        commit("setPlayer", ["duration", playingEl.duration])
    }, 100)

    const updateProgress = (single?: boolean) => {
      updateDuration()

      try {
        const progress = playingEl.currentTime / playingEl.duration || 0
        commit("setPlayer", ["progress", progress])
      } catch (err) {
        return "ignore"
      }

      if (state.player.playing && !single)
        window.requestAnimationFrame(() => updateProgress())
    }

    const updateNotificationPositionState = throttle(() => {
      const { duration, playbackRate, currentTime } = playingEl
      const isAnyNaN = (numbers: number[]) =>
        Boolean(numbers.filter(n => isNaN(n)).length)

      if (!isAnyNaN([duration, playbackRate, currentTime]))
        notification.setPositionState({ duration, playbackRate, currentTime })
    }, 500)

    const setVolume = throttle(() => {
      playingEl.volume = state.preferences.defaultVolume
    }, 1e3 / 30)

    const setOncanplay = () => {
      playingEl.oncanplaythrough = () => {
        playingEl.oncanplaythrough = null
        if (state.player.setPosition === false) return

        const currentTime = state.player.setPosition * playingEl.duration
        if (!isNaN(currentTime)) playingEl.currentTime = currentTime

        commit("setPlayer", ["setPosition", false])
      }
    }

    const setPosition = () => {
      if (state.player.setPosition === false) return

      const currentTime = state.player.setPosition * playingEl.duration

      if (!isNaN(currentTime)) {
        playingEl.currentTime = currentTime
        commit("setPlayer", ["setPosition", false])
      }

      updateProgress(true)
    }

    const onPlaybackStateChange = async () => {
      const { playing } = state.player

      setVolume()

      if (lastPlaybackState.value === playing) return
      lastPlaybackState.value = playing

      updateNotificationPositionState()

      if (playing) {
        playingEl.autoplay = true
        try {
          await playingEl.play()
        } catch (e) {
          "ignore"
        }
        updateProgress()
      } else {
        playingEl.autoplay = false
        playingEl.pause()
      }
    }

    const onended = async () => {
      // TODO implement repeating tracks
      await dispatch("nextTrack")
      commit("setPlayer", ["playing", true])
    }

    const initAudioEl = () => {
      playingEl.onplay = () => commit("setPlayer", ["playing", true])
      playingEl.onpause = () => {
        if (state.player.progress < 0.999) commit("setPlayer", ["playing", false])
      }
      playingEl.onended = onended
    }

    onMounted(() => {
      playingEl.volume = state.player.volume
      playingEl.src = state.currentTrack.stream
      setOncanplay()
      notification.init()
      initAudioEl()
      onPlaybackStateChange()
    })

    onBeforeUnmount(() => {
      playingEl.src = ""
      playingEl.pause()
      nextEl.src = ""
      nextEl.pause()
    })

    watch(() => state.player.playing, onPlaybackStateChange)
    watch(() => state.player.setPosition, setPosition)
    watch(() => state.preferences.defaultVolume, setVolume)
    watch(
      () => state.currentTrack.stream,
      async n => {
        playingEl.src = n
        await playingEl.play()
        setOncanplay()
        onPlaybackStateChange()
      }
    )
  },
})
