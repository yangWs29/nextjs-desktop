import path from 'path'

export const playableVideoExtensions = new Set([
  '.mp4',
  '.webm',
  '.mkv',
  '.mov',
  '.avi',
  '.flv',
  '.ogg',
  '.wmv',
  '.mpeg',
  '.mpg',
])

// Regular expression pattern for video file extensions
export const videoExtensionPattern = /\.(mp4|webm|mkv|mov|avi|flv|ogg|wmv|mpeg|mpg)$/i

export const isPlayableVideo = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase()
  return playableVideoExtensions.has(ext)
}
