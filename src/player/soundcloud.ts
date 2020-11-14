import { MusicSource, Playlist, PlaylistTracks, Track, User } from "./musicSource"
import axios from "axios"

type SoundcloudUser = {
  followers_count: number
  followings_count: number
  username: string
  id: number
  description: string
  track_count: number
  playlist_count: number
  public_favorites_count: number
}
const transformUser = (s: SoundcloudUser): User => ({
  platform: "soundcloud",
  username: s.username,
  followerCount: s.followers_count,
  followsCount: s.followings_count,
  id: s.id,
  description: s.description,
  trackCount: s.track_count,
  playlistCount: s.playlist_count,
  likesCount: s.public_favorites_count,
})

type SoundcloudPlaylist = {
  user: {
    id: number
    username: string
  }
  track_count: number
  id: number
  title: string
  duration: number
  last_modified: string
  artwork_url: string
  description: string
}
const transformPlaylistInfo = (p: SoundcloudPlaylist): Playlist => ({
  artwork: p.artwork_url.replace("large", "t500x500"),
  description: p.description,
  duration: p.duration,
  id: p.id,
  lastModified: new Date(p.last_modified),
  platform: "soundcloud",
  title: p.title,
  trackCount: p.track_count,
  user: { platform: "soundcloud", ...p.user },
})

// cspell:ignore favoritings
type SoundcloudTrack = {
  duration: number
  id: number
  created_at: string
  title: string
  description?: string
  genre?: string
  user: {
    id: number
    username: string
  }
  artwork_url: string
  playback_count: number
  favoritings_count: number
}
const transformTrack = (t: SoundcloudTrack): Track => ({
  platform: "soundcloud",
  duration: t.duration,
  id: t.id,
  createdAt: new Date(t.created_at),
  title: t.title,
  description: t.description,
  genre: t.genre,
  user: { platform: "soundcloud", ...t.user },
  artwork: t.artwork_url,
  playbackCount: t.playback_count,
  likeCount: t.favoritings_count,
})

const base = "https://soundcloud.com"
const baseApi = "https://api.soundcloud.com"
// cspell:disable-next-line
const client_id = "z8LRYFPM4UK5MMLaBe9vixfph5kqNA25"
const auth = `client_id=${client_id}`

const isID = (input: string) => Boolean(/\d+/.exec(input))
const resolve = async (source: string) => {
  const url = new URL(source, base).toString()
  return await axios.get(`${baseApi}/resolve`, {
    params: { url, client_id },
  })
}

function paginateNext(
  url: string,
  key = "collection",
  transform = (a: any) => a,
  limit = 50
) {
  return async () => {
    const { data } = await axios.get(url, {
      params: { client_id, limit, linked_partitioning: true },
    })
    const ret = {
      [key]: data.collection.map(transform),
    }
    if (data.next_href) ret.next = paginateNext(data.next_href, key, transform, limit)
    return ret
  }
}

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
  async user(source) {
    if (isID(source)) {
      const { data } = await axios.get(`${baseApi}/users/${source}`, {
        params: { client_id },
      })
      return transformUser(data)
    } else {
      const { data } = await resolve(source)
      return transformUser(data)
    }
  },
  async playlistInfo(source) {
    if (isID(source)) {
      const { data } = await axios.get(`${baseApi}/playlists/${source}`, {
        params: { client_id },
      })
      return transformPlaylistInfo(data)
    } else {
      const { data } = await resolve(source)
      return transformPlaylistInfo(data)
    }
  },
  async track(source) {
    if (isID(source)) {
      const { data } = await axios.get(`${baseApi}/tracks/${source}`, {
        params: { client_id },
      })
      return transformTrack(data)
    } else {
      const { data } = await resolve(source)
      return transformTrack(data)
    }
  },
  async playlistTracks(source, limit = 50) {
    let id = source

    if (!isID(source)) {
      const { data } = await resolve(source)
      id = data.id
    }

    const { data } = await axios.get(`${baseApi}/playlists/${id}/tracks`, {
      params: { client_id, limit, linked_partitioning: true },
    })
    const ret: PlaylistTracks = {
      tracks: data.collection.map(transformTrack),
    }
    if (data.next_href)
      ret.next = paginateNext(data.next_href, "tracks", transformTrack, limit)

    return ret
  },
}

export default soundcloud
