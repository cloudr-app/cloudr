import { Platform } from "@/player/platformShortNames"

type URL = string
type Source = number

export interface MusicSource {
  playlistInfo(source: Source): Promise<Playlist>
  playlistTracks(source: Source, limit?: number): Promise<PlaylistTracks>
  stream(source: Source): Promise<URL>
  user(source: Source): Promise<User>
  track(source: Source): Promise<Track>
  resolve?(source: URL): Promise<any>
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
}

export interface Playlist {
  artwork: string
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
  createdAt: Date
  title: string
  description?: string
  genre?: string
  user: User
  artwork: string
  playbackCount?: number
  likeCount?: number
}

export interface Pagination {
  next?(): Promise<Pagination>
}

export interface PlaylistTracks extends Pagination {
  tracks: Track[]
}
