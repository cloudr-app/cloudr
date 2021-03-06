/* eslint-disable @typescript-eslint/camelcase */
import { MusicSource, PlaylistTracks, Track } from "@/player/musicSource"
import { defaultImage, kyCache, ls } from "@/utils"
import { AxiosInstance, AxiosRequestConfig } from "axios"

const ky = kyCache("tidal")

/**
 * A custom adapter for ky. Because openTIDAL uses axios and I couldn't get
 * caching to work the way I liked it, I wrote this adapter that roughly translates
 * an axios request to the config syntax of ky.
 */
// @ts-expect-error
const kyxios: AxiosInstance = async (config: AxiosRequestConfig) => {
  // disable native cache to let cloudr decide how to cache
  const headers: any = { "cache-control": "no-cache" }

  if (config.data && !config.headers["Content-Type"]) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    try {
      JSON.parse(config.data)
      headers["Content-Type"] = "application/json"
    } catch (err) {
      "ignore"
    }
  }

  if (config.auth) {
    const auth = btoa(`${config.auth.username}:${config.auth.password}`)
    headers.Authorization = `Basic ${auth}`
  }

  try {
    const req = await ky(config.url || "", {
      prefixUrl: config.baseURL,
      method: config.method,
      headers: { ...headers, ...config.headers },
      searchParams: config.params,
      body: config.data,
      throwHttpErrors: false,
    })
    if (config.responseType === "json") {
      const data = { data: await req.json() }
      return data
    }
    return req
  } catch (err) {
    "ignore"
  }
}

import {
  _track,
  // _auth,
  // _search,
  // _artist,
  _playlist,
  track as cachelessTrack,
} from "opentidal"
import { Track as TidalTrack } from "opentidal/lib/types"

const track = _track(kyxios)
// const auth = _auth(kyxios)
// const search = _search(kyxios)
// const artist = _artist(kyxios)
const playlist = _playlist(kyxios)

/* cspell: disable-next-line */
const client_id = "aR7gUaTK1ihpXOEP"

const numberToSize = (n: number) => `${n}x${n}`
const playlistImageSizes = [160, 320, 480, 640, 750, 1080].map(numberToSize)
const albumImageSizes = [80, 160, 320, 640, 1280].map(numberToSize)

const imageBaseURL = "https://resources.tidal.com/images"

const tidalImage = (uuid: string, srcSizes: string[]) => {
  if (!uuid) return [defaultImage]
  const ret = []

  for (const sizes of srcSizes) {
    const src = `${imageBaseURL}/${uuid.replace(/-/g, "/")}/${sizes}.jpg`
    ret.push({ src, sizes, type: "jpg" })
  }

  return ret
}

const paginateNext = (fn: Function, limit: number, total: number, offset = 0) => {
  return async () => {
    const ret: PlaylistTracks = {
      tracks: await fn(offset),
    }
    if (offset < total) ret.next = paginateNext(fn, limit, total, offset + limit)
    return ret
  }
}

const tidal: MusicSource = {
  async stream(id) {
    const login = ls("tidal-login")
    if (!login) {
      alert("no tidal access_token found")
      return ""
    }

    const { access_token } = login
    const stream = await cachelessTrack.stream({ id: +id, access_token })
    return stream.urls[0].replace("http://", "https://")
  },
  async track(id) {
    const data = await track.get({ client_id, id: +id })

    return {
      artwork: tidalImage(data.album.cover, albumImageSizes),
      duration: data.duration,
      id: String(data.id),
      platform: "tidal",
      title: data.title,
      user: {
        platform: "tidal",
        id: String(data.artist.id),
        username: data.artist.name || `user:${data.artist.id}`,
        avatar: [defaultImage],
        description: null,
      },
    }
  },
  async playlistInfo(uuid) {
    const data = await playlist.get({ client_id, uuid: String(uuid) })

    return {
      id: String(uuid),
      platform: "tidal",
      title: data.title,
      trackCount: data.numberOfTracks,
      artwork: tidalImage(data.squareImage, playlistImageSizes),
      user: {
        platform: "tidal",
        avatar: [defaultImage],
        id: String(data.creator.id),
        username: data.creator.name || `user:${data.creator.id}`,
        description: null,
      },
      description: data.description,
      duration: data.duration,
      lastModified: new Date(data.lastUpdated),
    }
  },
  async playlistTracks(uuid, limit = 50) {
    const data = await playlist.items({ client_id, uuid: String(uuid), limit })

    const transformTrack = ({ item }: { item: TidalTrack }): Track => ({
      platform: "tidal",
      title: item.title,
      id: String(item.id),
      user: {
        platform: "tidal",
        id: String(item.artist.id),
        username: item.artist.name,
        avatar: [defaultImage],
        description: null,
      },
      artwork: tidalImage(item.album.cover, albumImageSizes),
      duration: item.duration,
    })

    const ret: PlaylistTracks = {
      tracks: data.items.map(transformTrack),
    }

    if (data.totalNumberOfItems > limit) {
      const next = async (offset: number) => {
        const { items } = await playlist.items({
          client_id,
          uuid: String(uuid),
          limit,
          offset,
        })

        return items.map(transformTrack)
      }
      ret.next = paginateNext(next, limit, data.totalNumberOfItems, limit)
    }

    return ret
  },
}

export default tidal
