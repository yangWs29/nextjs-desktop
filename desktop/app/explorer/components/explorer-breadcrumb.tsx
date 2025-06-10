'use client'
import React from 'react'
import { Breadcrumb, Space } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { replaceDir } from '@/app/explorer/utils/file-utils'
import SelectFolders from '@/app/explorer/select-folders'
import { HomeOutlined } from '@ant-design/icons'

const ExplorerBreadcrumb = () => {
  const pathname = usePathname() // 处理 pathname 为 null 的情况

  if (!pathname) {
    return null // 或者返回一个默认的面包屑结构
  }
  const pathSegments = pathname.replace('/explorer/media/', '/explorer/').split('/').filter(Boolean)
  const items = [
    ...pathSegments.map((segment, index) => {
      const href = decodeURIComponent('/' + pathSegments.slice(0, index + 1).join('/'))

      return {
        title: (
          <Space>
            {index !== 0 && <SelectFolders dirPath={replaceDir(href)} />}
            {index === 0 && (
              <Link href="/explorer">
                <HomeOutlined />
              </Link>
            )}
          </Space>
        ),
        key: href,
      }
    }),
  ]

  return <Breadcrumb items={items} />
}

export default ExplorerBreadcrumb
