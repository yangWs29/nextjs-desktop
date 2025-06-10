import React from 'react'
import VideoPlayer from '@/app/explorer/media/video-player'
import { Card, Flex } from 'antd'
import { MediaList } from '@/app/explorer/media/media-list'
import { readDirectoryFiles } from '@/app/explorer/utils/read-directory-files'
import path from 'path'
import { playableVideoExtensions } from '@/app/explorer/media/media-utils'

type Props = {
  params: Promise<{
    filepath: string[]
  }>
}

const Page = async ({ params }: Props) => {
  const { filepath } = await params

  const decode_filepath = filepath.map((file) => decodeURIComponent(file))

  const files = await readDirectoryFiles(decode_filepath.slice(0, -1).join('/'))

  // 过滤出可播放的视频文件
  const videoFiles = files.filter((file) => {
    if (file.isDirectory) return false
    const ext = path.extname(file.name).toLowerCase()
    return playableVideoExtensions.has(ext)
  })

  return (
    <Card
      variant="borderless"
      title={`正在播放 ${decode_filepath[decode_filepath.length - 1]}`}
      styles={{ body: { flex: 1, overflow: 'hidden', display: 'flex' } }}
    >
      <Flex style={{ flex: 1, flexShrink: 0, marginRight: 20, overflow: 'hidden' }} align="flex-start">
        <VideoPlayer src={path.join('/explorer/static/', decode_filepath.join('/'))} />
      </Flex>
      <MediaList
        videoFiles={videoFiles}
        mediaDir={decode_filepath.slice(0, -1).join('/')}
        fileName={decode_filepath[decode_filepath.length - 1]}
      />
    </Card>
  )
}

export default Page
