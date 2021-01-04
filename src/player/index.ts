import { PlatformAccessor } from "@/utils"
import soundcloud from "@/player/soundcloud"

const player = (platform: PlatformAccessor) => {
  /* eslint-disable indent */
  switch (platform) {
    case "soundcloud":
    case "sc":
    default:
      return soundcloud
  }
  /* eslint-enable indent */
}

export default player
