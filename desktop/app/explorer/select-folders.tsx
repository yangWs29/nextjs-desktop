'use client'

import React, { useState } from 'react'
import { Select, Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { readDirectoryFilesAction } from '@/app/explorer/utils/read-directory-files-action'
import { pathJoin } from '@/app/explorer/utils/file-utils'

type SelectFoldersProps = {
  dirPath: string
  basePath?: string
  onChange?: (newPath: string) => void
}

// 🧠 缓存对象：path => folders[]
const folderCache = new Map<string, string[]>()

const SelectFolders = ({ dirPath, basePath = '/explorer/', onChange }: SelectFoldersProps) => {
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)

  const router = useRouter()

  // 获取当前路径最后一级文件夹名
  const currentFolderName = dirPath.split('/').pop() || '/'

  // 🔁 刷新函数（可复用）
  const refreshFolders = async (parentPath: string) => {
    setLoading(true)

    try {
      const files = await readDirectoryFilesAction(parentPath, 'name-asc')
      const foldersOnly = files.filter((f) => f.isDirectory).map((f) => f.name)

      folderCache.set(parentPath, foldersOnly)
      setFolders(foldersOnly)

      setLoading(false)
    } catch (err) {
      console.error('刷新目录失败:', err)
    }
  }

  // 点击下拉时才加载数据
  const handleDropdownVisibleChange = async (open: boolean) => {
    if (open && !hasLoaded) {
      const parentPath = dirPath.split('/').slice(0, -1).join('/') || '/'

      // 1️⃣ 检查缓存是否存在
      const cached = folderCache.get(parentPath)
      if (cached) {
        setFolders(cached)
        setHasLoaded(true)
      }

      // 2️⃣ 异步刷新数据（即使有缓存也刷新一次）
      refreshFolders(parentPath).finally(() => {
        setHasLoaded(true)
      })
    }
  }

  // 处理选择事件
  const handleSelect = (selectedDir: string) => {
    const newPath = pathJoin(dirPath.split('/').slice(0, -1).join('/'), selectedDir)
    router.push(pathJoin(basePath, newPath))
    if (onChange) {
      onChange(newPath)
    }
  }

  return (
    <Select
      showSearch
      style={{ minWidth: 200 }}
      value={currentFolderName}
      onSelect={handleSelect}
      onOpenChange={handleDropdownVisibleChange}
      loading={loading}
      options={folders.map((folder) => ({
        value: folder,
        label: folder,
      }))}
      suffixIcon={loading ? <Spin size="small" /> : undefined}
      notFoundContent={loading ? <Spin size="small" /> : undefined}
      filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) ?? false}
      placeholder="请选择目录"
    />
  )
}

export default SelectFolders
