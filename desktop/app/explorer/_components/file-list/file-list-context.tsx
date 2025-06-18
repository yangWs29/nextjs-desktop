'use client'
import React, { createContext, useState, useContext, useCallback } from 'react'
import { File } from '@/app/explorer/_utils/read-directory-files-action'

type FileListContextType = {
  files: File[]
  currentPath: string
  changeFileList: (files: File[]) => void
  removeFile: (path: string) => void
}

const FileListContext = createContext<FileListContextType | undefined>(undefined)

export function FileListProvider({
  initialFiles = [],
  currentPath,
  children,
}: {
  initialFiles?: File[]
  currentPath: string
  children: React.ReactNode
}) {
  const [files, setFiles] = useState<File[]>(initialFiles)

  const changeFileList = useCallback((newFiles: File[]) => {
    setFiles(newFiles)
  }, [])

  const removeFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name))
  }, [])

  return (
    <FileListContext.Provider
      value={{
        files,
        currentPath,
        changeFileList,
        removeFile,
      }}
    >
      {children}
    </FileListContext.Provider>
  )
}

export function useFileList() {
  const context = useContext(FileListContext)
  if (!context) {
    throw new Error('useFileList must be used within a FileListProvider')
  }
  return context
}
