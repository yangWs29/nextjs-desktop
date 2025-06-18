import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { createHash } from 'crypto'

// 缓存目录
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'images')

async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
  }
}

// 生成哈希用于缓存键
function generateCacheKey(rawPath: string, width: number | null, quality: number): string {
  const hash = createHash('sha1').update(`${rawPath}-w${width}-q${quality}`).digest('hex')
  return `${hash}.webp`
}

export async function GET(request: NextRequest) {
  await ensureCacheDir()

  const { searchParams } = new URL(request.url)
  const rawPath = decodeURIComponent(searchParams.get('path') || '') // 真实路径
  const widthStr = searchParams.get('w')
  const qualityStr = searchParams.get('q') || '80'

  if (!rawPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  const quality = Math.min(100, Math.max(0, parseInt(qualityStr, 10)))
  const width = widthStr ? parseInt(widthStr, 10) : null

  // 使用哈希生成固定长度的缓存键
  const cacheKey = generateCacheKey(rawPath, width, quality)
  const cachePath = path.join(CACHE_DIR, cacheKey)

  // 检查缓存是否存在
  try {
    const data = await fs.readFile(cachePath)
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    // 缓存不存在，继续处理
  }

  // 使用 rawPath 作为真实文件路径
  const imagePath = path.join(process.env.EXPLORER_BASE_PATH || process.cwd(), rawPath)

  let inputBuffer
  try {
    inputBuffer = await fs.readFile(imagePath)
  } catch (error) {
    console.error(`Error reading image at ${imagePath}:`, error)
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  // 使用 sharp 压缩图片
  let image = sharp(inputBuffer)
  if (width) {
    image = image.resize(width)
  }

  const compressedImage = await image.webp({ quality }).toBuffer()

  // 写入缓存
  await fs.writeFile(cachePath, compressedImage)

  return new NextResponse(compressedImage, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
