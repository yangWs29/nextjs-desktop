// edit-context.tsx
'use client'
import React, { createContext, useState, useContext, useCallback } from 'react'
import { CloseOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons'
import { App, Button, Card, Checkbox, Modal, Space } from 'antd'
import { deleteFile } from '@/app/explorer/actions'

type EditContextType = {
  edit: boolean
  toggleEdit: () => void
  isInclude: (file: string) => boolean
  files: string[]
  toggleFile: (file: string) => void
  changeFiles: React.Dispatch<React.SetStateAction<string[]>>
}

const EditContext = createContext<EditContextType | undefined>(undefined)

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [edit, setEdit] = useState(false)
  const [files, changeFiles] = useState<string[]>([])

  const toggleEdit = useCallback(() => {
    setEdit((prev) => !prev)
  }, [])

  return (
    <EditContext.Provider
      value={{
        edit,
        toggleEdit,
        files,
        changeFiles,
        isInclude: (file: string) => files.includes(file),
        toggleFile: (file) => {
          changeFiles((prev) => {
            if (prev.includes(file)) {
              return prev.filter((f) => f !== file)
            } else {
              return [...prev, file]
            }
          })
        },
      }}
    >
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => {
  const context = useContext(EditContext)
  if (context === undefined) {
    throw new Error('useEdit must be used within an EditProvider')
  }
  return context
}

export const FileItemCheckbox = ({ hrefDir }: { hrefDir: string }) => {
  const { isInclude, toggleFile, edit } = useEdit()

  return (
    edit && (
      <Card style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, background: 'rgba(0,0,0,.5)' }}>
        <Checkbox
          style={{ position: 'absolute', top: 5, right: 10 }}
          onChange={() => toggleFile(hrefDir)}
          checked={isInclude(hrefDir)}
        />
      </Card>
    )
  )
}

export const ActionsBtn = () => {
  const { toggleEdit, edit, files, changeFiles } = useEdit()
  const { message } = App.useApp()
  const [confirmVisible, setConfirmVisible] = useState(false)

  const showConfirm = () => {
    if (files.length === 0) {
      message.warning('请选择要删除的文件').then()
      return
    }
    setConfirmVisible(true)
  }

  const handleDeleteConfirm = async () => {
    const result = await deleteFile(files)

    if (result.success) {
      message.success(result?.results?.map(({ message }) => message).join(','))
      changeFiles([])
    } else {
      message.error(result?.results?.map(({ message }) => message).join(','))
    }

    setConfirmVisible(false)
  }

  const handleCancel = () => {
    setConfirmVisible(false)
  }

  return (
    <Space>
      {edit && (
        <>
          <Button icon={<DeleteOutlined />} danger={true} onClick={showConfirm} />
          <Modal
            title="确认删除"
            open={confirmVisible}
            onOk={handleDeleteConfirm}
            onCancel={handleCancel}
            okText="确认删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <p>你确定要删除以下文件吗？</p>
            <ul style={{ listStyle: 'disc inside', paddingLeft: 20 }}>
              {files.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
            <p style={{ color: '#ff4d4f' }}>此操作不可恢复，请谨慎操作。</p>
          </Modal>
        </>
      )}
      <Button icon={edit ? <CloseOutlined /> : <ToolOutlined />} onClick={toggleEdit} />
    </Space>
  )
}
