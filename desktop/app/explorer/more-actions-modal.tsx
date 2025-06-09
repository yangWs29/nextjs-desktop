// more-actions-modal.tsx
'use client'
import { MoreOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Select } from 'antd'
import React, { useState } from 'react'
import { File } from '@/app/explorer/read-directory-files'
import TerminalClient from '@/app/explorer/terminal-client'
import { getSocket } from '@/app/explorer/socket'
import { useTerminal } from '@/app/explorer/terminal-context'
import FileMoveForm from '@/app/explorer/file-move-form'
import SevenZipExtractForm from '@/app/explorer/seven-zip-extract-form'

const MoreActionsModal = ({
  file,
  currentPath,
  baseDir = '/',
}: {
  currentPath: string
  file: File
  baseDir?: string
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [form] = Form.useForm()
  const terminal = useTerminal()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedAction(null)
    form.resetFields()
  }

  const handleActionChange = (value: string) => {
    setSelectedAction(value)
  }

  return (
    <>
      <Button
        icon={<MoreOutlined />}
        type="text"
        onClick={(e) => {
          e.stopPropagation()
          showModal()
        }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />

      <Drawer
        styles={{
          header: { height: 40 },
          body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        }}
        destroyOnHidden={true}
        height="80%"
        title={`${file.name}`}
        open={isModalOpen}
        onClose={handleCancel}
        footer={false}
        placement="bottom"
      >
        <Form form={form}>
          <Form.Item label="操作" name="action" rules={[{ required: true, message: '请选择一个操作' }]}>
            <Select
              options={[
                { label: '7z 解压缩', value: '7z-extract' },
                { label: '移动', value: 'move' },
              ]}
              onChange={handleActionChange}
              placeholder="选择操作"
            />
          </Form.Item>

          {selectedAction === '7z-extract' && (
            <SevenZipExtractForm
              fileName={file.name}
              baseDir={baseDir}
              onExtractSubmitAction={(command) => {
                const socket = getSocket()
                socket.emit('terminal-input', command)
                terminal?.current?.focus()
              }}
            />
          )}

          {selectedAction === 'move' && (
            <FileMoveForm
              currentPath={currentPath}
              baseDir={baseDir}
              fileName={file.name}
              onMoveSubmitAction={(sourcePath, targetPath) => {
                const socket = getSocket()
                const command = `mv "${sourcePath}" "${targetPath}"`
                socket.emit('terminal-input', command)
                terminal?.current?.focus()
              }}
            />
          )}
        </Form>

        <TerminalClient currentPath={decodeURIComponent(currentPath)} />
      </Drawer>
    </>
  )
}

export default MoreActionsModal
