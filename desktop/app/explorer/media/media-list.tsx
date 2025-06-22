'use client'
import React from 'react'
import Link from 'next/link'
import { List } from 'antd'
import { dirJoinAndEncode } from '@/app/explorer/_utils/file-utils'

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
    <List style={{ maxWidth: '240px', overflowY: 'auto' }}>
      {videoFiles.map((file, index) => (
        <List.Item key={index} style={{ padding: '8px' }}>
          <Link href={dirJoinAndEncode('/explorer/media/', mediaDir, file.name)} replace>
            <div
              ref={(el) => {
                if (file.name === fileName && el) {
                  el.scrollIntoView({ block: 'center' })
                }
              }}
              style={{
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: file.name === fileName ? 'rgba(255,255,255,.8)' : 'transparent',
                borderRadius: file.name === fileName ? '4px' : '0',
                padding: '4px 8px',
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
