'use client'
import { Form, Input, Button, Switch, Space } from 'antd'
import BtnTreeSelectDir from '@/app/explorer/_components/btn-tree-select-dir'
import { pathJoin } from '@/app/explorer/_utils/file-utils'

interface SevenZipExtractFormProps {
  fileName: string // 当前文件名
  baseDir?: string // 基础路径
  onExtractSubmitAction: (command: string[]) => void // 提交命令回调
}

export default function SevenZipExtractForm({
  fileName,
  baseDir = '/',
  onExtractSubmitAction,
}: SevenZipExtractFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    const action = values.preview ? 'l' : 'x' // l = list, x = extract
    const command = ['7z', action, values.filename]

    if (values.password) {
      command.push(`-p${values.password}`)
    }

    if (!values.preview && values.savePath) {
      command.push(`-o${pathJoin(baseDir, values.savePath)}`)
    }

    onExtractSubmitAction(command)
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Space style={{ width: '100%' }}>
        <Form.Item label="文件名" name="filename" initialValue={fileName} rules={[{ required: true }]}>
          <Input value={fileName} disabled />
        </Form.Item>
        <Form.Item label="解压密码" name="password">
          <Input placeholder="输入密码（可选）" />
        </Form.Item>
        <Form.Item label="保存路径" name="savePath">
          <Input
            placeholder="选择保存路径"
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
    </Form>
  )
}
