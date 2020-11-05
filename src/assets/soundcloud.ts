interface SoundcloudUser {
  followers_count: number
  followings_count: number
  username: string
  id: number
  description: string
  track_count: number
  playlist_count: number
  public_favorites_count: number
}

import { MusicSource, User } from "./musicSource"
import axios from "axios"

// cspell:ignore LRYFPM vixfph
const base = "https://soundcloud.com"
const baseApi = "https://api.soundcloud.com"
const client_id = "z8LRYFPM4UK5MMLaBe9vixfph5kqNA25"
const auth = `client_id=${client_id}`

const isID = (input: string): boolean => Boolean(/\d+/.exec(input))

const soundcloud: MusicSource = {
  async stream(source) {
    const idToStream = (id: string) => `${baseApi}/tracks/${id}/stream?${auth}`

    if (isID(source)) return idToStream(source)
    else {
      const url = new URL(source, base).toString()
      const { data } = await axios.get(`${baseApi}/resolve`, {
        params: { url, client_id },
      })
      return idToStream(data.id)
    }
  },
  async user(source): Promise<User> {
    const transformUser = (s: SoundcloudUser): User => ({
      platform: "soundcloud",
      username: s.username,
      followers_count: s.followers_count,
      follows_count: s.followings_count,
      id: s.id,
      description: s.description,
      track_count: s.track_count,
      playlist_count: s.playlist_count,
      likes_count: s.public_favorites_count,
    })
    if (isID(source)) {
      const { data } = await axios.get(`${baseApi}/users/${source}`)
      return transformUser(data)
    } else {
      const url = new URL(source, base).toString()
      const { data } = await axios.get(`${baseApi}/resolve`, {
        params: { url, client_id },
      })
      return transformUser(data)
    }
  },
}

export default soundcloud
