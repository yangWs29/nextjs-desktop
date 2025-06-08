import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

// 读取 base path（可选：从配置文件中读取）
import { app_config } from '@/app-config.mjs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return new Response(`Not found ${filePath}`, { status: 404 })
  }

  try {
    // ✅ 解码路径并清理路径穿越字符
    const decodedPath = decodeURIComponent(filePath).replace(/^(\.\.\/)+/, '')
    const fullPath = path.join(app_config.explorer_base_path, decodedPath)

    // ✅ 校验路径是否合法
    if (!fullPath.startsWith(app_config.explorer_base_path)) {
      return new Response('Forbidden', { status: 403 })
    }

    // ✅ 检查文件是否存在
    try {
      await fs.promises.access(fullPath)
    } catch {
      return new Response(`File not found ${decodedPath}`, { status: 404 })
    }
    // ✅ 获取文件扩展名并设置 Content-Type
    const ext = path.extname(filePath).toLowerCase()
    const contentType =
      {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
      }[ext] || 'application/octet-stream'

    const fileStat = await fs.promises.stat(fullPath)

    const option: { start?: number; end?: number } = {}

    const range = request.headers.get('Range') || ''
    let rangeHeaders = {}

    if (range) {
      const positions = range.replace(/bytes=/, '').split('-')
      const start = positions[0] ? parseInt(positions[0], 10) : 0
      const total = fileStat.size
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1
      const chunk_size = end - start + 1

      rangeHeaders = {
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Content-Length': chunk_size.toString(),
      }

      option.start = start
      option.end = end
    }

    // ✅ 创建可读流
    const fileStream = fs.createReadStream(fullPath, option)

    // ✅ 将 Node.js 流转换为 Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => {
          controller.enqueue(chunk)
        })
        fileStream.on('end', () => {
          controller.close()
        })
        fileStream.on('error', (err) => {
          controller.error(err)
        })
      },
    })
    // ✅ 返回流式响应
    return new Response(readableStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `filename=${path.basename(fullPath) || 'download'}`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: Buffer.from(fullPath).toString('base64'),
        'Content-Length': fileStat.size.toString(),
        'Last-Modified': fileStat.mtime.toUTCString(),
        ...rangeHeaders,
      },
    })
  } catch (error: any) {
    console.error('Error reading file:', error)
    return new Response('Internal Error', { status: 500 })
  }
}
