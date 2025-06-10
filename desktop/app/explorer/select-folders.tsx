'use client'

import React, { useState } from 'react'
import { Select, Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { readDirectoryFiles } from '@/app/explorer/utils/read-directory-files'
import { pathJoin } from '@/app/explorer/utils/file-utils'

type SelectFoldersProps = {
  dirPath: string
  basePath?: string
  onChange?: (newPath: string) => void
}

const SelectFolders = ({ dirPath, basePath = '/explorer/', onChange }: SelectFoldersProps) => {
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)

  const router = useRouter()

  // 获取当前路径最后一级文件夹名
  const currentFolderName = dirPath.split('/').pop() || '/'

  // 点击下拉时才加载数据
  const handleDropdownVisibleChange = async (open: boolean) => {
    if (open && !hasLoaded) {
      setLoading(true)
      try {
        const parentPath = dirPath.split('/').slice(0, -1).join('/') || '/'
        const files = await readDirectoryFiles(parentPath)
        const foldersOnly = files.filter((f) => f.isDirectory).map((f) => f.name)
        setFolders(foldersOnly)
        setHasLoaded(true)
      } catch (err) {
        console.error('读取目录失败:', err)
      } finally {
        setLoading(false)
      }
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
      onChange={handleSelect}
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
