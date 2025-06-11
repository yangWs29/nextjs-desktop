'use client'
import { Form, Input, Button } from 'antd'
import BtnTreeSelectDir from '@/app/explorer/components/btn-tree-select-dir'
import { pathJoin } from '@/app/explorer/utils/file-utils'

interface FileMoveFormProps {
  currentPath: string
  baseDir?: string
  fileName: string
  onMoveSubmitAction: (sourcePath: string, targetPath: string) => void
}

export default function FileMoveForm({ currentPath, baseDir = '/', fileName, onMoveSubmitAction }: FileMoveFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    const sourcePath = pathJoin(baseDir, currentPath, fileName)
    const targetPath = pathJoin(baseDir, values.moveTarget)

    onMoveSubmitAction(sourcePath, targetPath)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="当前路径">
        <Input value={`${baseDir}${currentPath}/${fileName}`} disabled />
      </Form.Item>

      <Form.Item label="目标路径" name="moveTarget" rules={[{ required: true }]}>
        <Input
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

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          移动
        </Button>
      </Form.Item>
    </Form>
  )
}
