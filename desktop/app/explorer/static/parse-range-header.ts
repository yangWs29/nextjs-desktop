import type { NextRequest } from 'next/server'

interface ParsedRange {
  start: number
  end: number
  chunkSize: number
  headers: {
    'Content-Range': string
    'Content-Length': string
    'Accept-Ranges': string
  }
}

export function parseRangeHeader(request: NextRequest, total: number): ParsedRange | null {
  const range = request.headers.get('Range')

  if (!range || !range.startsWith('bytes=')) {
    return null
  }

  const [startStr, endStr] = range.replace('bytes=', '').split('-')
  const parsedStart = startStr === '' ? undefined : parseInt(startStr, 10)
  const parsedEnd = endStr === '' ? undefined : parseInt(endStr, 10)

  let start = parsedStart !== undefined ? parsedStart : 0
  let end = parsedEnd !== undefined ? parsedEnd : total - 1

  // 边界检查
  if (isNaN(start) || isNaN(end) || start >= total || end >= total || start > end) {
    throw new Response('Requested range not satisfiable', {
      status: 416,
      headers: {
        'Content-Range': `bytes */${total}`,
      },
    })
  }

  const chunkSize = end - start + 1

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Content-Length': String(chunkSize),
    'Accept-Ranges': 'bytes',
  }

  return {
    start,
    end,
    chunkSize,
    headers,
  }
}
