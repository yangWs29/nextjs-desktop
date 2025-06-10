import fs from 'fs'
import { join, extname, basename } from 'path'
import { NextRequest } from 'next/server'
import { Readable } from 'stream'
import { parseRangeHeader } from '@/app/explorer/static/parse-range-header'
import { app_config } from '@/app-config.mjs'
import { isPreviewable } from '@/app/explorer/static/is-previewable'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  // 获取请求路径
  const filePath = (await params).path.join('/')
  const fullPath = decodeURIComponent(join(app_config.explorer_base_path, filePath))

  try {
    // 检查文件是否存在
    await fs.promises.access(fullPath)
  } catch {
    return new Response('File not found', { status: 404 })
  }

  try {
    // 获取文件信息
    const fileStat = await fs.promises.stat(fullPath)
    if (fileStat.isDirectory()) {
      return new Response('Is a directory', { status: 400 })
    }

    // 解析文件扩展名并设置 MIME 类型
    const ext = extname(fullPath).toLowerCase()
    const mimeType =
      {
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.mov': 'video/quicktime',
        '.avi': 'video/x-msvideo',
        '.wmv': 'video/x-ms-wmv',
        '.flv': 'video/x-flv',
        '.mkv': 'video/x-matroska',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip',
        '.7z': 'application/x-7z-compressed',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
      }[ext] || 'application/octet-stream'

    // 判断是否浏览器可以直接预览
    const isPreviewableType = isPreviewable(mimeType, ext)

    // 构建响应头
    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: Buffer.from(fullPath).toString('base64'),
      'Last-Modified': fileStat.mtime.toUTCString(),
    }

    // 设置 Content-Disposition
    const filename = basename(filePath)
    const encodedFilename = encodeURIComponent(filename)
    const dispositionType = isPreviewableType ? 'inline' : 'attachment'

    headers['Content-Disposition'] =
      `${dispositionType}; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`

    // ✅ 解析 Range 请求
    let rangeData = null
    try {
      rangeData = parseRangeHeader(request, fileStat.size)

      // ✅ 合并 rangeHeaders（如果存在）
      if (rangeData) {
        Object.entries(rangeData.headers).forEach(([key, value]) => {
          headers[key] = value
        })
      }
    } catch (e) {
      if (e instanceof Response) {
        return e
      }
      return new Response('Internal Server Error', { status: 500 })
    }

    // 读取文件流
    const fileStream = fs.createReadStream(fullPath, { start: rangeData?.start, end: rangeData?.end })
    const webStream = Readable.toWeb(fileStream) as ReadableStream

    // 监听客户端中断请求
    request.signal.addEventListener('abort', () => {
      fileStream.destroy()
    })

    return new Response(webStream, {
      status: rangeData ? 206 : 200,
      headers,
    })
  } catch (error) {
    console.error('读取文件失败:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
