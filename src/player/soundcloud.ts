/* eslint-disable @typescript-eslint/camelcase */
import { MusicSource, Playlist, PlaylistTracks, Track, User } from "@/player/musicSource"
import { defaultImage, imageType, imageTypes, kyCache } from "@/utils"

const ky = kyCache("soundcloud")

const soundcloudImageSizes = {
  mini: "16x16",
  small: "32x32",
  badge: "47x47",
  large: "100x100",
  t300x300: "300x300",
  crop: "400x400",
  t500x500: "500x500",
}
const getURLFileName = (url: string) => /(\.(?:jpg|png|gif))$/im.exec(url)?.[1]
const soundcloudImage = (url?: string) => {
  if (!url) return [defaultImage]
  const ret = []
  const file = (getURLFileName(url) || ".png").toLowerCase() as imageType
  const type = imageTypes[file]

  for (const [name, sizes] of Object.entries(soundcloudImageSizes)) {
    const src = url.replace("large", name)
    ret.push({ src, sizes, type })
  }
  return ret
}

interface SoundcloudUser {
  followers_count?: number
  followings_count?: number
  username: string
  id: number
  description?: string
  track_count?: number
  playlist_count?: number
  public_favorites_count?: number
  avatar_url: string
}
const transformUser = (s: SoundcloudUser): User => ({
  platform: "soundcloud",
  username: s.username,
  followerCount: s.followers_count,
  followsCount: s.followings_count,
  id: s.id,
  description: s.description || "",
  trackCount: s.track_count,
  playlistCount: s.playlist_count,
  likesCount: s.public_favorites_count,
  avatar: soundcloudImage(s.avatar_url),
})

// cspell:ignore favoritings
interface SoundcloudTrack {
  duration: number
  id: number
  created_at: string
  title: string
  description?: string
  genre?: string
  user: SoundcloudUser
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
  user: transformUser(t.user),
  artwork: soundcloudImage(t.artwork_url || t.user.avatar_url),
  playbackCount: t.playback_count,
  likeCount: t.favoritings_count,
})

interface SoundcloudPlaylist {
  user: SoundcloudUser
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
  artwork: soundcloudImage(p.artwork_url || p.tracks[0]?.artwork_url),
  description: p.description,
  duration: p.duration,
  id: p.id,
  lastModified: new Date(p.last_modified),
  platform: "soundcloud",
  title: p.title,
  trackCount: p.track_count,
  user: transformUser(p.user),
})

interface SoundcloudPlaylistTracks {
  collection: SoundcloudTrack[]
  next_href: string | null
}

const base = "https://soundcloud.com"
const baseApi = "https://api.soundcloud.com"

// ! this seems bad, but it's not as bad as a 1.5MB response to
// ! get basic data about the playlists of a user
const baseApi2 = "https://cors-anywhere.herokuapp.com/https://api-v2.soundcloud.com"
// cspell:disable-next-line
const client_id = "z8LRYFPM4UK5MMLaBe9vixfph5kqNA25"
const client_id2 = "XmvD0222mkoRiRKkf97v8i5K2FtAX5dH"

const paginateNext = (
  url: string,
  key = "collection",
  transform = (a: any) => a,
  limit = 50
) => {
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

const userPlaylists = async (id: number) => {
  const data = (await ky
    .get(`${baseApi2}/users/${id}/playlists_without_albums`, {
      searchParams: {
        client_id: client_id2,
        limit: 500,
        offset: 0,
        linked_partitioning: true,
      },
      headers: {
        origin: location.origin,
      },
    })
    .json()) as any

  return data.collection as any[]
}

const apiResolve = async (source: string) => {
  const url = new URL(source, base)
  return (await ky
    .get(`${baseApi}/resolve`, {
      searchParams: { url: url.toString(), client_id },
    })
    .json()) as any
}

const soundcloud: MusicSource = {
  stream: id => Promise.resolve(`${baseApi}/tracks/${id}/stream?client_id=${client_id}`),
  async resolve(source) {
    const url = new URL(source, base)
    const path = url.pathname.slice(1).split("/")
    const platform = "soundcloud"

    if (path.length === 2 && path[1] === "likes") {
      const user = await apiResolve(path[0])
      if (user) {
        return {
          name: "Likes",
          params: { id: user.id, "0": "likes", platform },
        }
      }
    } else if (path.length === 3 && path[1] === "sets") {
      const user = await apiResolve(path[0])
      const playlists = await userPlaylists(user.id)
      const playlist = playlists.find(pl => pl.permalink === path[2])
      if (playlist && user) {
        return {
          name: "Playlist",
          params: { id: playlist.id, "0": "playlist", platform },
        }
      }
    }

    console.log("fallback to traditional resolve for", url.toString())
    const resolved = await apiResolve(url.toString())

    if (resolved.kind === "playlist")
      return { name: "Playlist", params: { id: resolved.id, "0": "playlist", platform } }
    if (resolved.kind === "user")
      return { name: "User", params: { id: resolved.id, "0": "user", platform } }

    return resolved
  },
  async likes(id, limit = 50) {
    const data = (await ky
      .get(`${baseApi}/users/${id}/favorites`, {
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
  async user(id) {
    const data = (await ky
      .get(`${baseApi}/users/${id}`, {
        searchParams: { client_id },
      })
      .json()) as SoundcloudUser

    return transformUser(data)
  },
  async userPlaylists(id) {
    const data = await userPlaylists(id)
    return data.map(transformPlaylistInfo)
  },
  async track(id) {
    const data = (await ky
      .get(`${baseApi}/tracks/${id}`, {
        searchParams: { client_id },
      })
      .json()) as SoundcloudTrack

    return transformTrack(data)
  },
  async playlistInfo(id) {
    const data = (await ky
      .get(`${baseApi}/playlists/${id}`, {
        searchParams: { client_id, linked_partitioning: true, limit: 1 },
      })
      .json()) as SoundcloudPlaylist

    return transformPlaylistInfo(data)
  },
  async playlistTracks(id, limit = 50) {
    const data = (await ky
      .get(`${baseApi}/playlists/${id}/tracks`, {
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
  async userTracks(id, page_size = 50) {
    const data = (await ky
      .get(`${baseApi}/users/${id}/tracks`, {
        searchParams: { client_id, page_size, linked_partitioning: true },
      })
      .json()) as SoundcloudPlaylistTracks

    const ret: PlaylistTracks = {
      tracks: data.collection.map(transformTrack),
    }
    if (data.next_href)
      ret.next = paginateNext(data.next_href, "tracks", transformTrack, page_size)

    return ret
  },
}

export default soundcloud
