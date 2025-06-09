'use client'
import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import TreeSelectDir from '@/app/explorer/components/tree-select-dir'
import { FolderOutlined } from '@ant-design/icons'

interface BtnTreeSelectDirProps {
  baseDir?: string // 基础目录路径，例如：'/videos'
  onConfirm?: (selectedPath: string) => void // 确认回调
}

const BtnTreeSelectDir: React.FC<BtnTreeSelectDirProps> = ({ baseDir = '', onConfirm }) => {
  const [visible, setVisible] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string>('')

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const handleOk = () => {
    console.log({ selectedPath })
    if (onConfirm && selectedPath) {
      onConfirm(selectedPath)
    }
    handleClose()
  }

  const handleSelect = (path: string) => {
    setSelectedPath(path)
  }

  return (
    <>
      <Button type="text" onClick={handleOpen} icon={<FolderOutlined />} />

      <Modal
        title="选择目录"
        open={visible}
        onOk={handleOk}
        onCancel={handleClose}
        okText="确认"
        cancelText="取消"
        width={600}
        styles={{ body: { maxHeight: '50vh', overflowY: 'auto' } }}
      >
        <TreeSelectDir baseDir={baseDir} onSelect={handleSelect} />
      </Modal>
    </>
  )
}

export default BtnTreeSelectDir
