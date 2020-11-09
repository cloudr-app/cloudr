export type MusicSource = {
  stream(source: string): Promise<string>
  user(source: string): Promise<User>
}

export type User = {
  platform: string
  username: string
  id: number
  likes_count?: number
  track_count?: number
  playlist_count?: number
  followers_count?: number
  follows_count?: number
  description?: string
}
