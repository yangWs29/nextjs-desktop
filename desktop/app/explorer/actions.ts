'use server'

import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { app_config } from '@/app-config.mjs'

export async function deleteFile(paths: string[]) {
  try {
    const results = []

    for (const itemPath of paths) {
      // 安全验证
      const safePath = path.normalize(itemPath).replace(/^(\.\.(\/|\\|$))+/, '')
      const fullPath = path.join(app_config.explorer_base_path, safePath)
      const itemName = path.basename(fullPath)

      if (!fullPath.startsWith(app_config.explorer_base_path)) {
        results.push({
          path: itemPath,
          success: false,
          message: `${itemName} 不在允许的范围内`,
          type: 'unknown',
        })
        continue
      }

      // 检查路径是否存在
      try {
        await fs.access(fullPath)
      } catch {
        results.push({
          path: itemPath,
          success: false,
          message: `${itemName} 不存在`,
          type: 'unknown',
        })
        continue
      }

      // 统一使用 fs.rm 删除
      try {
        await fs.rm(fullPath, { recursive: true, force: true })

        const stats = await fs.stat(fullPath).catch(() => null)
        const itemType = stats?.isDirectory() ? 'directory' : 'file'

        console.log(`${itemType === 'directory' ? '目录' : '文件'} ${itemName} 删除成功`)

        results.push({
          path: itemPath,
          success: true,
          message: `${itemType === 'directory' ? '目录' : '文件'} ${itemName} 删除成功`,
          type: itemType,
        })
      } catch (error) {
        results.push({
          path: itemPath,
          success: false,
          message: error instanceof Error ? `删除 ${itemName} 失败: ${error.message}` : `删除 ${itemName} 失败`,
          type: 'unknown',
        })
      }
    }

    revalidatePath('/explorer')
    return { success: true, results }
  } catch (error) {
    console.error('删除操作失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除操作失败',
    }
  }
}
