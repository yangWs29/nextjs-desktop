'use client'
import PreviewGroup from 'antd/es/image/PreviewGroup'
import Image from 'next/image'
import React, { createContext, useContext, useState } from 'react'
import { pathJoin } from '@/app/explorer/utils/file-utils'

type PreviewContextType = {
  openPreview: (src: string) => void
  closePreview: () => void
  previewSrc: string | null
  images: string[]
}

const PreviewContext = createContext<PreviewContextType | null>(null)

export const ImagePreviewProvider = ({ children, images }: { children: React.ReactNode; images: string[] }) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  return (
    <PreviewContext.Provider
      value={{
        openPreview: (src) => setPreviewSrc(src),
        closePreview: () => setPreviewSrc(null),
        previewSrc: previewSrc,
        images: images,
      }}
    >
      <ImagePreviewGroup />
      {children}
    </PreviewContext.Provider>
  )
}

export const usePreview = () => {
  const context = useContext(PreviewContext)

  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider')
  }

  return context
}

export const ImagePreviewGroup = () => {
  const { previewSrc, images, openPreview, closePreview } = usePreview()

  const current = images.findIndex((image) => image === previewSrc)

  return (
    <PreviewGroup
      preview={{
        visible: !!previewSrc,
        getContainer: 'body',
        current,
        onChange: (current) => {
          console.log(images[current])
          openPreview(images[current])
        },
        onVisibleChange: (visible) => {
          !visible && closePreview()
        },
      }}
      items={images.map((file_path) => pathJoin('/explorer/static/', encodeURIComponent(file_path)))}
    />
  )
}

export const ImageItem = ({ file_path }: { file_path: string }) => {
  const { openPreview } = usePreview()

  return (
    <Image
      onClick={() => openPreview(file_path)}
      src={`${pathJoin('/explorer/static/', encodeURIComponent(file_path))}`}
      alt={file_path}
      fill // 填充父容器
      style={{
        objectFit: 'cover',
        cursor: 'pointer',
      }}
      unoptimized={file_path.endsWith('.gif')}
      sizes="100px"
    />
  )
}
