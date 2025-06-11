'use server'
import path from 'path'
import { app_config } from '@/app-config.mjs'
import fs from 'fs/promises'
import {
  getHideHiddenOptionFromCookie,
  getSortOptionFromCookie,
} from '@/app/explorer/utils/get-hide-hidden-option-from-cookie'

export type File = {
  name: string
  dirPath: string
  isDirectory: boolean
  createdAt: Date // 创建时间
  updatedAt: Date // 修改时间
  size: number // 文件大小（字节）
}

// 排序选项类型
export type SortOptionType =
  | 'name-asc' // 文件名 A-Z
  | 'name-desc' // 文件名 Z-A
  | 'date-asc' // 创建时间 旧→新
  | 'date-desc' // 创建时间 新→旧
  | 'size-asc'
  | 'size-desc'

// 判断是否为隐藏文件（以 . 开头）
const isHiddenFile = (filename: string): boolean => {
  return filename.startsWith('.')
}

export const readDirectoryFilesAction = async ({
  dirPath = '',
  sortBy,
  hideHiddenFiles,
  onlyDir = false,
}: {
  dirPath: string
  sortBy?: SortOptionType
  hideHiddenFiles?: boolean
  onlyDir?: boolean
}): Promise<File[]> => {
  try {
    const resolvedSortBy = sortBy || (await getSortOptionFromCookie())
    const resolvedHideHidden = hideHiddenFiles ? hideHiddenFiles : await getHideHiddenOptionFromCookie()

    const fullPath = path.join(app_config.explorer_base_path, decodeURIComponent(dirPath))
    const files = await fs.readdir(fullPath, { withFileTypes: true })

    // 过滤隐藏文件（如果启用）
    const filteredFiles = resolvedHideHidden ? files.filter((file) => !isHiddenFile(file.name)) : files

    // 获取文件详细信息
    const filesWithStats = await Promise.all(
      filteredFiles.map(async (file) => {
        const filePath = path.join(fullPath, file.name)
        const stats = await fs.stat(filePath)

        return {
          name: file.name,
          dirPath: decodeURIComponent(dirPath),
          isDirectory: file.isDirectory(),
          createdAt: stats.birthtime || stats.ctime,
          updatedAt: stats.mtime,
          size: stats.size,
        }
      }),
    )

    // 排序逻辑
    return filesWithStats
      .filter(({ isDirectory }) => {
        return !onlyDir || isDirectory
      })
      .sort((a, b) => {
        switch (resolvedSortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
          case 'name-desc':
            return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' })
          case 'date-asc':
            return a.createdAt.getTime() - b.createdAt.getTime()
          case 'date-desc':
            return b.createdAt.getTime() - a.createdAt.getTime()
          case 'size-asc':
            return a.size - b.size
          case 'size-desc':
            return b.size - a.size
          default:
            return 0
        }
      })
  } catch (error) {
    console.error(`Error reading directory ${decodeURIComponent(dirPath)}:`, error)
    return []
  }
}
