// tree-select-dir.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { Tree } from 'antd'
import path from 'path'
import { readDirectoryFilesAction } from '@/app/explorer/utils/read-directory-files-action'

const { DirectoryTree } = Tree

interface InputSelectDirProps {
  baseDir: string // 基础目录路径，例如：'/videos'
  onSelect?: (selectedPath: string) => void // 选中路径回调
}

export interface DirNode {
  title: string
  value: string
  children: DirNode[]
  isLeaf: boolean
}

const TreeSelectDir: React.FC<InputSelectDirProps> = ({ baseDir, onSelect }) => {
  const [treeData, setTreeData] = useState<DirNode[]>([])

  // 读取单个目录下的子目录
  const loadSubDirectories = async (dirPath: string): Promise<DirNode[]> => {
    const files = await readDirectoryFilesAction({ dirPath })
    return files
      .filter((file) => file.isDirectory)
      .map((file) => {
        const fullPath = path.join(dirPath, file.name)
        return {
          title: file.name,
          value: fullPath,
          children: [],
          isLeaf: false,
        }
      })
  }

  // 加载根目录下的子目录
  useEffect(() => {
    const safeBaseDir = baseDir || ''
    if (!safeBaseDir) {
      console.warn('baseDir 为空，跳过加载')
      return
    }

    const loadRootDirs = async () => {
      try {
        const dirs = await loadSubDirectories(safeBaseDir)
        setTreeData(dirs)
      } catch (err) {
        console.error('加载根目录失败', err)
      }
    }

    loadRootDirs()
  }, [baseDir])

  // 动态加载子目录（hover 或点击时）
  const onLoadData = async (treeNode: any) => {
    return new Promise<void>(async (resolve) => {
      if (treeNode && treeNode.children.length === 0) {
        const subDirs = await loadSubDirectories(treeNode.value)
        setTreeData((prev) => updateTreeData(prev, treeNode.value, subDirs))
      }
      resolve()
    })
  }

  // 更新 treeData 中某节点的子节点
  const updateTreeData = (list: DirNode[], value: string, children: DirNode[]): DirNode[] => {
    return list.map((node) => {
      if (node.value === value) {
        return {
          ...node,
          children,
        }
      } else if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, value, children),
        }
      }
      return node
    })
  }

  return (
    <DirectoryTree
      multiple={false}
      defaultExpandAll={false}
      treeData={treeData}
      loadData={onLoadData}
      onSelect={(keys, info) => {
        if (onSelect && info?.node?.value) {
          onSelect(info.node.value as string)
        }
      }}
      showLine
      fieldNames={{ title: 'title', key: 'value', children: 'children' }}
    />
  )
}

export default TreeSelectDir
