'use client'
import React from 'react'
import Link from 'next/link'
import { List } from 'antd'

interface File {
  name: string
  isDirectory: boolean
}

interface MediaListProps {
  videoFiles: File[]
  mediaDir: string
  fileName: string
}

export const MediaList: React.FC<MediaListProps> = ({ videoFiles, mediaDir, fileName }) => {
  if (videoFiles.length === 0) {
    return <p>当前目录下没有可播放的视频文件</p>
  }

  return (
    <List>
      {videoFiles.map((file, index) => (
        <List.Item key={index} style={{ padding: '8px' }}>
          <Link href={`/explorer/media/${mediaDir}/${encodeURIComponent(file.name)}`}>
            <div
              style={{
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: file.name === fileName ? 'bold' : 'normal',
              }}
            >
              {file.name}
            </div>
          </Link>
        </List.Item>
      ))}
    </List>
  )
}
