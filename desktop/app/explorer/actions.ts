'use server'

export async function deleteFileAction(path: string[]) {
  return await import('@/app/explorer/utils/delete-file').then((mod) => mod.deleteFile(path))
}

export async function checkDiskUsageAction(path: string) {
  return await import('@/app/explorer/utils/check-disk-usage').then((mod) =>
    mod.checkDiskUsage(decodeURIComponent(path)),
  )
}
