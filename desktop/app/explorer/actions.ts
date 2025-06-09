'use server'

export async function deleteFile(path: string[]) {
  return await import('@/app/explorer/utils/delete-file').then((mod) => mod.deleteFile(path))
}

export async function checkDiskUsage(path: string) {
  return await import('@/app/explorer/utils/check-disk-usage').then((mod) => mod.checkDiskUsage(path))
}
