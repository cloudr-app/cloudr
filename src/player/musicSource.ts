import { Platform } from "@/utils"

type URL = string
export type ID = string

export interface MusicSource {
  playlistInfo(source: ID): Promise<Playlist>
  playlistTracks(source: ID, limit?: number): Promise<PlaylistTracks>
  userTracks?(source: ID, limit?: number): Promise<PlaylistTracks>
  stream(source: ID): Promise<URL>
  track(source: ID): Promise<Track>
  user?(source: ID): Promise<User>
  resolve?(source: URL): Promise<any>
  likes?(source: ID, limit?: number): Promise<PlaylistTracks>
  userPlaylists?(source: ID): Promise<Playlist[]>
}

// TODO make more of these non-optional
export interface User {
  id: ID
  platform: Platform
  username: string
  description: string | null
  followerCount?: number
  followsCount?: number
  likesCount?: number
  playlistCount?: number
  trackCount?: number
  avatar: MediaImage[]
}

export interface Playlist {
  artwork: MediaImage[]
  id: ID
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
  id: ID
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
