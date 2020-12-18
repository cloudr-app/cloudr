export const touchEventOffset = (event: any, target?: any) => {
  target = target || event.currentTarget

  const cx = event.clientX || 0
  const cy = event.clientY || 0
  const rect = target.getBoundingClientRect()

  return [cx - rect.left, cy - rect.top]
}

export const formatTime = (secs: number) => {
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor(secs / 60 - hours * 60)
  const seconds = Math.floor(secs - minutes * 60 - hours * 3600)

  const pad = (n: number) => String(n).padStart(2, "0")
  let ret = `${pad(minutes)}:${pad(seconds)}`

  if (hours) ret = `${hours}:${ret}`

  return ret
}
