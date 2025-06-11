'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation' // 👈 引入 usePathname
import { Card, Tree } from 'antd'
import { File, readDirectoryFilesAction } from '@/app/explorer/utils/read-directory-files-action'
import { pathJoin } from '@/app/explorer/utils/file-utils'
import Link from 'next/link'
import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons'

interface TreeNode {
  title: string
  key: string
  isLeaf?: boolean
  children?: TreeNode[]
}

type TreeKey = React.Key

const DirTree = () => {
  const pathname = usePathname() // ✅ 使用 usePathname 获取当前路径
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<TreeKey[]>([])
  const [isUserExpand, setIsUserExpand] = useState(false)

  // 判断 pathname 的前部分为 /explorer/media 时不显示组件
  if (pathname?.startsWith('/explorer/media')) return null

  // 映射文件数据为 TreeNode 结构
  const mapToTreeNode = (items: Array<File>, parentKey: string): TreeNode[] => {
    return items.map((item) => {
      const fullPath = item.isDirectory ? pathJoin(item.dirPath, item.name) : `${parentKey}/${item.name}`
      return {
        title: item.name,
        key: fullPath,
        isLeaf: !item.isDirectory,
        children: item.isDirectory ? [] : undefined,
      }
    })
  }

  // 加载子目录
  const loadSubDirs = async (node: TreeNode) => {
    if (node.children?.length) return

    try {
      const subDirs = await readDirectoryFilesAction({ dirPath: node.key, onlyDir: true })
      const mappedSubDirs = mapToTreeNode(subDirs, node.key)

      const updateTree = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((n) => {
          if (n.key === node.key) {
            return { ...n, children: mappedSubDirs }
          } else if (n.children) {
            return { ...n, children: updateTree(n.children) }
          }
          return n
        })
      }

      const newTreeData = updateTree([...treeData])
      setTreeData(newTreeData)
    } catch (error) {
      console.error('Failed to load sub directories:', error)
    }
  }

  // 首次加载根目录
  useEffect(() => {
    const loadRootChildren = async () => {
      try {
        const rootChildren = await readDirectoryFilesAction({ dirPath: '/', onlyDir: true })
        const initialTreeData = mapToTreeNode(rootChildren, '/')
        setTreeData(initialTreeData)
      } catch (error) {
        console.error('Failed to load root directory contents:', error)
      }
    }

    loadRootChildren().then()
  }, [])

  // 🌟 首次挂载时根据 pathname 自动展开对应节点
  useEffect(() => {
    if (isUserExpand) return
    if (treeData.length === 0) return

    // 🔹 获取当前路径并去除 /explorer 前缀
    const relativePath = pathname?.replace(/^\/explorer/, '') || ''
    const pathSegments = relativePath.split('/').filter(Boolean)

    // 🔹 递归查找需要展开的 keys
    const findExpandedKeys = (nodes: TreeNode[], segments: string[], currentPath = ''): TreeKey[] => {
      let keys: TreeKey[] = []
      for (const segment of segments) {
        const fullPath = pathJoin(currentPath, segment)
        const node = nodes.find((n) => n.key === fullPath)
        if (!node) break
        keys.push(fullPath)
        if (node.children && node.children.length > 0) {
          nodes = node.children!
          currentPath = fullPath
        } else {
          break
        }
      }
      return keys
    }

    const keys = findExpandedKeys(treeData, pathSegments)
    setExpandedKeys(keys)
  }, [pathname, treeData]) // 依赖 pathname 和 treeData

  // 节点展开/收起回调
  const onExpand = (keys: TreeKey[]) => {
    setExpandedKeys(keys)
    setIsUserExpand(true)
  }

  // 自定义节点标题渲染
  const titleRender = (node: any) => {
    // 检查当前节点的路径是否是激活路径的一部分
    const nodePath = pathJoin('/explorer', node.key)
    const decodedPathname = decodeURIComponent(pathname || '')
    const isExactMatch = decodedPathname === nodePath
    const isPathActive = isExactMatch || decodedPathname.startsWith(nodePath + '/')
    return (
      <Link
        href={pathJoin('/explorer', node.key)}
        style={{
          whiteSpace: 'nowrap',
          color: isPathActive ? '#1890ff' : 'inherit',
          fontWeight: isPathActive ? 'bold' : 'normal',
        }}
      >
        {node.title}
      </Link>
    )
  }

  return (
    <Card
      style={{
        width: 250,
        marginRight: 10,
      }}
      styles={{
        body: {
          overflowY: 'scroll',
          height: '100%',
        },
      }}
    >
      <Tree
        treeData={treeData}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        loadData={(node) => loadSubDirs(node as TreeNode)}
        titleRender={titleRender}
        showIcon={false}
        switcherIcon={({ expanded }) => {
          return expanded ? <FolderOpenOutlined /> : <FolderOutlined style={{ transform: 'rotate(90deg)' }} />
        }}
      />
    </Card>
  )
}

export default DirTree
