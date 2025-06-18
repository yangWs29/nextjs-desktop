'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Select, App } from 'antd'

interface CertificateFormProps {
  onSubmit: (values: any) => Promise<void>
  parentCerts: string[]
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit, parentCerts }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      await onSubmit(formData)
      message.success('证书生成成功')
      form.resetFields()
    } catch (error) {
      message.error('证书生成失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="通用名称" name="commonName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="有效期（天）" name="days" initialValue={365}>
        <Input type="number" min={1} />
      </Form.Item>
      <Form.Item label="是否是CA证书" name="isCA" valuePropName="checked">
        <Select>
          <Select.Option value={true}>是</Select.Option>
          <Select.Option value={false}>否</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="上级证书" name="parentCert" dependencies={['isCA']}>
        <Select placeholder="选择一个上级证书">
          {parentCerts.map((cert) => (
            <Select.Option key={cert} value={cert}>
              {cert}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="组织" name="organization">
        <Input />
      </Form.Item>
      <Form.Item label="部门" name="organizationalUnit">
        <Input />
      </Form.Item>
      <Form.Item label="国家代码" name="country" initialValue="CN">
        <Input />
      </Form.Item>
      <Form.Item label="省份" name="state" initialValue="Beijing">
        <Input />
      </Form.Item>
      <Form.Item label="城市" name="locality" initialValue="Beijing">
        <Input />
      </Form.Item>
      <Form.Item label="邮箱" name="email">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        提交
      </Button>
    </Form>
  )
}

export default CertificateForm
