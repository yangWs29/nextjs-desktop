'use client'
import { ExportOutlined } from '@ant-design/icons'
import React from 'react'
import { dirJoinAndEncode } from '@/app/explorer/utils/file-utils'
import { useSelected } from '@/app/explorer/more-context'
import Link from 'next/link'

const OpenOriginalBtn = ({ file_path }: { file_path: string }) => {
  const { selected } = useSelected()

  return selected ? null : (
    <Link
      style={{
        position: 'absolute',
        top: 3,
        right: 3,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: '12px',
        zIndex: 1,
        color: 'inherit',
      }}
      href={dirJoinAndEncode('/explorer/static/', file_path)}
      target="_blank"
      prefetch={false}
    >
      <ExportOutlined />
    </Link>
  )
}

export default OpenOriginalBtn
