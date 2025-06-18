const archiveExtensions = new Set([
  '.zip',
  '.rar',
  '.7z',
  '.tar',
  '.gz',
  '.bz2',
  '.xz',
  '.z',
  '.jar',
  '.war',
  '.iso',
  '.dmg',
  '.tgz', // tar.gz 的简写
  '.tbz2', // tar.bz2 的简写
])

export function isArchiveFile(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
  return archiveExtensions.has(ext)
}
