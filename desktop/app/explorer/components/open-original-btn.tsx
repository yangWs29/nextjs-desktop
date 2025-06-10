'use client'
import { ExportOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { pathJoin } from '@/app/explorer/utils/file-utils'
import { useEdit } from '@/app/explorer/edit-context'

const OpenOriginalBtn = ({ file_path }: { file_path: string }) => {
  const { edit } = useEdit()
  const handleOpenOriginal = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`${pathJoin('/explorer/static/', encodeURIComponent(file_path))}`, '_blank')
  }

  return edit ? null : (
    <Button
      type="text"
      onClick={handleOpenOriginal}
      icon={<ExportOutlined />}
      style={{
        position: 'absolute',
        top: 3,
        right: 3,
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: '12px',
        zIndex: 1,
      }}
    />
  )
}

export default OpenOriginalBtn
