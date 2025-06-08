import fs from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

// 读取 base path（可选：从配置文件中读取）
import { app_config } from '@/app-config.mjs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const fullPath = path.join(app_config.explorer_base_path, filePath)
    const data = await fs.readFile(fullPath)

    // 设置正确的 Content-Type
    const ext = path.extname(filePath).toLowerCase()
    const contentType =
      {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
      }[ext] || 'application/octet-stream'

    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': contentType },
    })
  } catch (error: any) {
    return new Response('Internal Error', { status: 500 })
  }
}
