'use client'
import React from 'react'
import { Breadcrumb } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const ExplorerBreadcrumb = () => {
  const pathname = usePathname() // 处理 pathname 为 null 的情况

  if (!pathname) {
    return null // 或者返回一个默认的面包屑结构
  }

  const pathSegments = pathname.split('/').filter(Boolean)

  const items = [
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      const isLast = index === pathSegments.length - 1
      const decodedSegment = decodeURIComponent(segment)

      return {
        title: isLast ? decodedSegment : <Link href={href}>{decodedSegment}</Link>,
        key: href,
      }
    }),
  ]

  return <Breadcrumb items={items} />
}

export default ExplorerBreadcrumb
