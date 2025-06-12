'use server'

import { cookies } from 'next/headers'

export async function deleteFileAction(path: string[]) {
  return await import('@/app/explorer/utils/delete-file').then((mod) => mod.deleteFile(path))
}

export async function checkDiskUsageAction(path: string) {
  return await import('@/app/explorer/utils/check-disk-usage').then((mod) =>
    mod.checkDiskUsage(decodeURIComponent(path)),
  )
}

export async function changeZoomLevel(zoomLevel: number) {
  // 设置 zoomLevel 到 cookie
  ;(await cookies()).set('zoomLevel', zoomLevel.toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 有效期为 7 天
    path: '/',
  })
}
