export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  const kb = bytes / 1024
  if (kb < 1024) return kb.toFixed(2) + ' KB'
  const mb = kb / 1024
  if (mb < 1024) return mb.toFixed(2) + ' MB'
  return (mb / 1024).toFixed(2) + ' GB'
}

export function pathJoin(...arg: string[]) {
  return (
    '/' +
    arg
      .join('/')
      .split('/')
      .filter((item) => Boolean(item.trim()))
      .join('/')
  )
}

export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return fileName.slice(lastDotIndex + 1)
}

export function replaceDir(dir: string) {
  return dir.replace(/^\/explorer\/?(media)?/, '/')
}

export const isTextFile = /\.(txt|text|log|md|markdown|csv|tsv|json|xml|yml|yaml|toml|ini|conf|env)$/i
