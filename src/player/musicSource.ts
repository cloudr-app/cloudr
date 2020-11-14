import { Platform } from "./platformShortNames"

export type MusicSource = {
  playlistInfo(source: string): Promise<Playlist>
  playlistTracks(source: string, limit?: number): Promise<PlaylistTracks>
  stream(source: string): Promise<string>
  user(source: string): Promise<User>
  track(source: string): Promise<Track>
}

export type User = {
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

export type Playlist = {
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

export type Track = {
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
