import { createHash } from 'crypto'

export default function imageLoader({ src, width, quality = 80 }: { src: string; width: number; quality?: number }) {
  // 如果是 base64 或远程 URL，直接返回
  if (src.startsWith('data:') || src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality}`
  }

  if (src.startsWith('/')) {
    return `/image?path=${encodeURIComponent(src)}&w=${width}&q=${quality}`
  }

  // 对于非绝对路径的其他情况，继续使用哈希处理
  const hash = createHash('sha1').update(src).digest('hex').substring(0, 20)

  // 返回统一格式的图片请求路径
  return `/image?path=${encodeURIComponent(hash)}&w=${width}&q=${quality}`
}
