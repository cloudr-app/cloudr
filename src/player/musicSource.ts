import { Platform } from "@/utils"

type URL = string
type Source = number

export interface MusicSource {
  playlistInfo(source: Source): Promise<Playlist>
  playlistTracks(source: Source, limit?: number): Promise<PlaylistTracks>
  stream(source: Source): Promise<URL>
  track(source: Source): Promise<Track>
  user?(source: Source): Promise<User>
  resolve?(source: URL): Promise<any>
  likes?(source: Source, limit?: number): Promise<PlaylistTracks>
  userPlaylists?(source: Source): Promise<Playlist[]>
}

export interface User {
  id: number
  platform: Platform
  username: string
  description?: string
  followerCount?: number
  followsCount?: number
  likesCount?: number
  playlistCount?: number
  trackCount?: number
  avatar: MediaImage[]
}

export interface Playlist {
  artwork: MediaImage[]
  id: number
  platform: Platform
  title: string
  trackCount: number
  user: User
  description?: string
  duration?: number
  lastModified?: Date
}

export interface Track {
  platform: Platform
  duration: number
  id: number
  createdAt?: Date
  title: string
  description?: string
  genre?: string
  user: User
  artwork: MediaImage[]
  playbackCount?: number
  likeCount?: number
}
export interface MediaImage {
  src: string
  sizes: string
  type: string
}

export interface Pagination {
  next?(): Promise<Pagination>
}

export interface PlaylistTracks extends Pagination {
  tracks: Track[]
}
