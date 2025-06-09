// more-actions-modal.tsx
'use client'
import { MoreOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { File } from '@/app/explorer/read-directory-files'
import TerminalClient from '@/app/explorer/terminal-client'
import { getSocket } from '@/app/explorer/socket'
import { useTerminal } from '@/app/explorer/terminal-context'
import BtnTreeSelectDir from '@/app/explorer/btn-tree-select-dir'
import { pathJoin } from '@/app/explorer/file-utils'

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

  const handleOk = () => {
    const socket = getSocket()

    form.validateFields().then((values) => {
      if (values.action === '7z-extract') {
        const action = values.preview ? 'l' : 'x' // 'l' 是查看列表，'x' 是解压缩
        const command = ['7z', action, `-p${values.password || ''}`, values.filename]

        if (!values.preview) {
          command.push(`-o${baseDir}${values.savePath}`)
        }

        socket.emit('terminal-input', command.join(' '))
        terminal?.current?.focus()
      } else if (values.action === 'move') {
        const sourcePath = `${pathJoin(baseDir, currentPath, file.name)}`
        const targetPath = `${pathJoin(baseDir, values.moveTarget)}`

        // 示例：使用 Node.js 或 shell 命令执行文件移动
        const command = `mv "${sourcePath}" "${targetPath}"`

        socket.emit('terminal-input', command)
        terminal?.current?.focus()
      }
    })
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
        <Form form={form} onFinish={handleOk}>
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
            <>
              <Space style={{ width: '100%' }}>
                <Form.Item label="文件名" name="filename" initialValue={file.name}>
                  <Input value={file.name} disabled />
                </Form.Item>
                <Form.Item label="解压密码" name="password">
                  <Input placeholder="输入密码（可选）" />
                </Form.Item>
                <Form.Item label="保存路径" name="savePath" rules={[{ required: true }]}>
                  <Input
                    addonAfter={
                      <BtnTreeSelectDir
                        baseDir={'/'}
                        onConfirm={(selectedPath) => {
                          form.setFieldsValue({ savePath: selectedPath })
                        }}
                      />
                    }
                  />
                </Form.Item>
              </Space>

              <Form.Item style={{ textAlign: 'right' }}>
                <Space>
                  <Form.Item noStyle={true}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Form.Item>
                  <Form.Item name="preview" noStyle={true}>
                    <Switch checkedChildren="预览" unCheckedChildren="预览" />
                  </Form.Item>
                </Space>
              </Form.Item>
            </>
          )}

          {selectedAction === 'move' && (
            <>
              <Form.Item label="当前路径">
                <Input value={pathJoin(baseDir, currentPath, file.name)} placeholder="当前路径" disabled />
              </Form.Item>
              <Space style={{ width: '100%' }}>
                <Form.Item label="目标路径" name="moveTarget" rules={[{ required: true }]}>
                  <Input
                    style={{ width: '50vw' }}
                    placeholder="选择目标路径"
                    addonAfter={
                      <BtnTreeSelectDir
                        baseDir={'/'}
                        onConfirm={(selectedPath) => {
                          form.setFieldsValue({ moveTarget: selectedPath })
                        }}
                      />
                    }
                  />
                </Form.Item>
              </Space>

              <Form.Item style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  移动
                </Button>
              </Form.Item>
            </>
          )}
        </Form>

        <TerminalClient currentPath={decodeURIComponent(currentPath)} />
      </Drawer>
    </>
  )
}

export default MoreActionsModal
