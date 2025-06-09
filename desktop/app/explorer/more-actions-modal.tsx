'use client'
import { MoreOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { File } from '@/app/explorer/read-directory-files'
import TerminalClient from '@/app/explorer/terminal-client'
import { getSocket } from '@/app/explorer/socket'
import { useTerminal } from '@/app/explorer/terminal-context'
import BtnTreeSelectDir from '@/app/explorer/btn-tree-select-dir'

const MoreActionsModal = ({
  file,
  currentPath,
  baseDir,
}: {
  currentPath: string
  file: File
  hrefDir: string
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

        // 预览时不添加 -o 参数
        if (!values.preview) {
          command.push(`-o${baseDir}${values.savePath}`)
        }

        console.log(command.join(' '))

        socket.emit('terminal-input', `${command.join(' ')}`)
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
          header: {
            height: 40,
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
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
              options={[{ label: '7z 解压缩', value: '7z-extract' }]}
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
        </Form>

        <TerminalClient currentPath={decodeURIComponent(currentPath)} />
      </Drawer>
    </>
  )
}

export default MoreActionsModal
