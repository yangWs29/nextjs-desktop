const DEFAULT_PREVIEWABLE_MIME_TYPES = ['text/*', 'image/*', 'video/*', 'application/pdf']
const DEFAULT_PREVIEWABLE_EXTENSIONS = ['.md', '.log', '.csv']

export function isPreviewable(mimeType: string, ext: string): boolean {
  const PREVIEWABLE_MIME_TYPES = (process.env.PREVIEWABLE_MIME_TYPES || DEFAULT_PREVIEWABLE_MIME_TYPES.join(','))
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const PREVIEWABLE_EXTENSIONS = (process.env.PREVIEWABLE_EXTENSIONS || DEFAULT_PREVIEWABLE_EXTENSIONS.join(','))
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const mimeMatch = PREVIEWABLE_MIME_TYPES.some((pattern) => {
    if (pattern.endsWith('/*')) {
      return mimeType.startsWith(pattern.slice(0, -2))
    }
    return mimeType === pattern
  })

  const extMatch = PREVIEWABLE_EXTENSIONS.includes(ext.toLowerCase())

  return mimeMatch || extMatch
}
