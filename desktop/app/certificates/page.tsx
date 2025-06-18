'use client'

import React, { useState } from 'react'
import { Card, List, Button, Modal, Typography } from 'antd'
import {
  getCertificates,
  getCertificateDetail,
  removeCertificate,
  createCertificate,
  downloadPfx,
} from '@/app/certificates/actions'
import CertificateForm from '@/app/certificates/_components/CertificateForm'

const { Text } = Typography

type CertificateChainItem = {
  name: string
  pem: string
}

type CertificateDetail = {
  name: string
  content: string
  issuer: string
  subject: string
  notBefore: string
  notAfter: string
  serialNumber: string
  chain: CertificateChainItem[]
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [certDetail, setCertDetail] = useState<CertificateDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 加载证书列表
  React.useEffect(() => {
    const loadCerts = async () => {
      const certs = await getCertificates()
      setCerts(certs)
      setIsLoading(false)
    }
    loadCerts()
  }, [])

  // 查看证书详情
  const handleViewDetail = async (certName: string) => {
    const content = await getCertificateDetail(certName)
    setCertDetail(content)
  }

  // 删除证书
  const handleDelete = async (certName: string) => {
    await removeCertificate(certName)
    const newCerts = await getCertificates()
    setCerts(newCerts)
  }

  // 提交成功后刷新
  const handleSubmitSuccess = async (formData: FormData) => {
    await createCertificate(formData)
    setIsModalOpen(false)
    const newCerts = await getCertificates()
    setCerts(newCerts)
  }

  const handleDownloadPfx = async (certName: string) => {
    const { name, content } = await downloadPfx(certName)
    const byteCharacters = atob(content)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray.buffer], { type: 'application/x-pkcs12' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card
      title="证书列表"
      style={{ height: '100vh', borderRadius: 0 }}
      extra={
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          添加证书
        </Button>
      }
    >
      <List
        loading={isLoading}
        dataSource={certs}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button key="view" type="text" onClick={() => handleViewDetail(item)}>
                查看
              </Button>,
              <Button key="delete" type="text" onClick={() => handleDelete(item)} style={{ color: 'red' }}>
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta title={<Text strong>{item}</Text>} />
          </List.Item>
        )}
      />

      {/* 证书详情 Modal */}
      <Modal title="证书内容" open={!!certDetail} onCancel={() => setCertDetail(null)} width={800}>
        {certDetail && (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            <Text strong>
              证书名称：
              <Button key="download-pfx" onClick={() => handleDownloadPfx(certDetail.name)}>
                下载 PFX
              </Button>
            </Text>
            <p>{certDetail.name}</p>

            <Text strong>主题：</Text>
            <p>
              {certDetail.subject
                .split(',')
                .map((item) => {
                  const [key, value] = item.trim().split('=')
                  const cnMap: Record<string, string> = {
                    CN: '通用名称 (CN)',
                    C: '国家 (C)',
                    ST: '省份 (ST)',
                    L: '城市 (L)',
                    O: '组织 (O)',
                    OU: '部门 (OU)',
                    E: '邮箱 (E)',
                  }
                  return `${cnMap[key] || key}=${value}`
                })
                .join('，')}
            </p>

            <Text strong>颁发机构：</Text>
            <p>
              {certDetail.issuer
                .split(',')
                .map((item) => {
                  const [key, value] = item.trim().split('=')
                  const cnMap: Record<string, string> = {
                    CN: '通用名称 (CN)',
                    C: '国家 (C)',
                    ST: '省份 (ST)',
                    L: '城市 (L)',
                    O: '组织 (O)',
                    OU: '部门 (OU)',
                    E: '邮箱 (E)',
                  }
                  return `${cnMap[key] || key}=${value}`
                })
                .join('，')}
            </p>
            <Text strong>有效期：</Text>
            <p>
              {new Date(certDetail.notBefore).toLocaleDateString('zh-CN')} ~
              {new Date(certDetail.notAfter).toLocaleDateString('zh-CN')}
            </p>

            <Text strong>序列号：</Text>
            <p>{certDetail.serialNumber}</p>

            <Text strong>证书链：</Text>
            <ul>
              {certDetail.chain.map((chainCert, index) => (
                <li key={index}>
                  <strong>{chainCert.name}</strong>
                  <pre style={{ maxHeight: 150, overflow: 'auto', fontSize: '12px' }}>{chainCert.pem}</pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* 添加证书 Modal */}
      <Modal title="添加证书" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <CertificateForm onSubmit={handleSubmitSuccess} parentCerts={certs} />
      </Modal>
    </Card>
  )
}
