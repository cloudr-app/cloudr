import { PlatformAccessor } from "@/utils"
import soundcloud from "@/player/soundcloud"
import tidal from "@/player/tidal"

const player = (platform: PlatformAccessor) => {
  /* eslint-disable indent */
  switch (platform) {
    case "tidal":
    case "td":
      return tidal
    case "soundcloud":
    case "sc":
    default:
      return soundcloud
  }
  /* eslint-enable indent */
}

export default player
