'use client'
import { createContext, useContext, useState } from 'react'
import { Image } from 'antd'

type PreviewContextType = {
  openPreview: (src: string) => void
  closePreview: () => void
}

const PreviewContext = createContext<PreviewContextType | null>(null)

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  return (
    <PreviewContext.Provider
      value={{
        openPreview: (src) => setPreviewSrc(src),
        closePreview: () => setPreviewSrc(null),
      }}
    >
      {children}
      {previewSrc && (
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: !!previewSrc,
            src: previewSrc,
            onVisibleChange: (visible) => {
              if (!visible) setPreviewSrc(null)
            },
          }}
        />
      )}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  const context = useContext(PreviewContext)
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider')
  }
  return context
}
