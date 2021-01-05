import {
  MusicSource,
  Playlist,
  PlaylistTracks,
  Track,
  User,
  MediaImage,
} from "@/player/musicSource"
import { defaultImage, kyCache } from "@/utils"

const ky = kyCache("soundcloud")

type SoundcloudImageType = ".png" | ".jpg" | ".gif"

const soundcloudImageSizes = {
  mini: "16x16",
  small: "32x32",
  badge: "47x47",
  large: "100x100",
  t300x300: "300x300",
  crop: "400x400",
  t500x500: "500x500",
}
const soundcloudImageTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
}
const getURLFileName = (url: string) => /(\.(?:jpg|png|gif))$/im.exec(url)?.[1]
const soundcloudImage = (url?: string): MediaImage[] | undefined => {
  if (!url) return
  const ret = []
  const file = (getURLFileName(url) || ".png").toLowerCase() as SoundcloudImageType
  const type = soundcloudImageTypes[file]

  for (const [name, sizes] of Object.entries(soundcloudImageSizes)) {
    const src = url.replace("large", name)
    ret.push({ src, sizes, type })
  }
  return ret
}

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

// cspell:ignore favoritings
interface SoundcloudTrack {
  duration: number
  id: number
  created_at: string
  title: string
  description?: string
  genre?: string
  user: {
    id: number
    username: string
    avatar_url?: string
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
  artwork: soundcloudImage(t.artwork_url || t.user.avatar_url) || [defaultImage],
  playbackCount: t.playback_count,
  likeCount: t.favoritings_count,
})

interface SoundcloudPlaylist {
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
  tracks: SoundcloudTrack[]
}
const transformPlaylistInfo = (p: SoundcloudPlaylist): Playlist => ({
  artwork: soundcloudImage(p.artwork_url || p.tracks[0]?.artwork_url) || [defaultImage],
  description: p.description,
  duration: p.duration,
  id: p.id,
  lastModified: new Date(p.last_modified),
  platform: "soundcloud",
  title: p.title,
  trackCount: p.track_count,
  user: { platform: "soundcloud", ...p.user },
})

interface SoundcloudPlaylistTracks {
  collection: SoundcloudTrack[]
  next_href: string | null
}

const base = "https://soundcloud.com"
const baseApi = "https://api.soundcloud.com"
// cspell:disable-next-line
const client_id = "z8LRYFPM4UK5MMLaBe9vixfph5kqNA25"
const auth = `client_id=${client_id}`

function paginateNext(
  url: string,
  key = "collection",
  transform = (a: any) => a,
  limit = 50
) {
  return async () => {
    const { searchParams } = new URL(url)
    searchParams.set("client_id", client_id)
    searchParams.set("limit", String(limit))
    searchParams.set("linked_partitioning", String(true))

    const data = (await ky.get(url, { searchParams }).json()) as any

    const ret = {
      [key]: data.collection.map(transform),
    }
    if (data.next_href) ret.next = paginateNext(data.next_href, key, transform, limit)
    return ret
  }
}

const soundcloud: MusicSource = {
  resolve: async source => {
    const url = new URL(source, base).toString()
    return await ky
      .get(`${baseApi}/resolve`, {
        searchParams: { url, client_id },
      })
      .json()
  },
  stream: source => Promise.resolve(`${baseApi}/tracks/${source}/stream?${auth}`),
  async user(source) {
    const data = (await ky
      .get(`${baseApi}/users/${source}`, {
        searchParams: { client_id },
      })
      .json()) as SoundcloudUser

    return transformUser(data)
  },
  async playlistInfo(source) {
    const data = (await ky
      .get(`${baseApi}/playlists/${source}`, {
        searchParams: { client_id, linked_partitioning: true, limit: 1 },
      })
      .json()) as SoundcloudPlaylist

    return transformPlaylistInfo(data)
  },
  async track(source) {
    const data = (await ky
      .get(`${baseApi}/tracks/${source}`, {
        searchParams: { client_id },
      })
      .json()) as SoundcloudTrack

    return transformTrack(data)
  },
  async playlistTracks(source, limit = 50) {
    const data = (await ky
      .get(`${baseApi}/playlists/${source}/tracks`, {
        searchParams: { client_id, limit, linked_partitioning: true },
      })
      .json()) as SoundcloudPlaylistTracks

    const ret: PlaylistTracks = {
      tracks: data.collection.map(transformTrack),
    }
    if (data.next_href)
      ret.next = paginateNext(data.next_href, "tracks", transformTrack, limit)

    return ret
  },
}

export default soundcloud
