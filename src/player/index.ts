import { MusicSource } from "./musicSource"
import { PlatformAccessor } from "./platformShortNames"
import soundcloud from "./soundcloud"

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
