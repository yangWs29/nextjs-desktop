'use client'
import React, { createContext, useState, useContext, useCallback } from 'react'
import { CloseOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { App, Button, Card, Modal, Space } from 'antd'
import { deleteFileAction } from '@/app/explorer/actions'

type EditContextType = {
  selected: boolean
  toggleSelected: () => void
  isInclude: (file: string) => boolean
  files: string[]
  toggleFile: (file: string) => void
  changeFiles: React.Dispatch<React.SetStateAction<string[]>>
}

const MoreContext = createContext<EditContextType | undefined>(undefined)

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState(false)
  const [files, changeFiles] = useState<string[]>([])

  const toggleSelected = useCallback(() => {
    setSelected((prev) => !prev)
  }, [])

  return (
    <MoreContext.Provider
      value={{
        selected,
        toggleSelected,
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
    </MoreContext.Provider>
  )
}

export const useSelected = () => {
  const context = useContext(MoreContext)
  if (context === undefined) {
    throw new Error('useSelected must be used within an SelectedProvider')
  }
  return context
}

export const FileItemCheckbox = ({ hrefDir }: { hrefDir: string }) => {
  const { isInclude, toggleFile, selected } = useSelected()
  const { message, modal } = App.useApp()

  return (
    selected && (
      <Card
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: isInclude(hrefDir) ? 'rgba(255, 215, 0, 0.6)' : 'rgba(0,0,0,.5)',
          transition: 'background 0.3s ease',
          cursor: 'pointer',
        }}
        onClick={() => toggleFile(hrefDir)}
      >
        <Button
          style={{ position: 'absolute', top: 10, right: 10 }}
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.stopPropagation()
            modal.confirm({
              title: '确认删除',
              content: `你确定要删除文件 ${hrefDir} 吗？`,
              okText: '确认删除',
              okButtonProps: { danger: true },
              cancelText: '取消',
              onOk: async () => {
                const result = await deleteFileAction([hrefDir])
                if (result.success) {
                  message.success(result?.results?.map(({ message }) => message).join(','))
                } else {
                  message.error(result?.results?.map(({ message }) => message).join(','))
                }
              },
            })
          }}
        />
      </Card>
    )
  )
}

export const ActionsBtn = () => {
  const { toggleSelected, selected, files, changeFiles } = useSelected()
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
    const result = await deleteFileAction(files)

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
      {selected && (
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
      <Button icon={selected ? <CloseOutlined /> : <MoreOutlined />} onClick={toggleSelected} />
    </Space>
  )
}
