'use server'

import {
  deleteCertificate,
  generateCertificateWithForge,
  generatePfx,
  getCertificateChain,
  getCertificatePath,
  getKeyPath,
  listCertificates,
  parseCertificate,
} from '@/app/certificates/_lib/certificateUtils'
import path from 'path'
import fs from 'fs/promises'
import { revalidatePath } from 'next/cache'
import { readFileSync } from 'node:fs'

// 获取所有证书名称（用于渲染列表）
export async function getCertificates() {
  return listCertificates()
}

// 新增 Server Action：生成 PFX 文件
export async function downloadPfx(certName: string) {
  const pfxBuffer = generatePfx(certName)

  // 返回 Base64 字符串供前端使用
  return {
    name: certName.replace('.crt', '.pfx'),
    content: pfxBuffer.toString('base64'),
  }
}

// 修改 getCertificateDetail 函数
export async function getCertificateDetail(certName: string) {
  const certPath = getCertificatePath(certName) // 修改路径获取方式
  const certPem = readFileSync(certPath, 'utf-8')
  const parsed = parseCertificate(certPem)
  const chain = getCertificateChain(certName).map((name) => ({
    name,
    pem: readFileSync(getCertificatePath(name), 'utf-8'),
  }))

  return {
    name: certName,
    content: certPem,
    chain,
    ...parsed,
  }
}

// 删除证书
export async function removeCertificate(certName: string) {
  deleteCertificate(certName)
  revalidatePath('/certificates') // 刷新页面
}

const CERT_DIR = path.join(process.env.EXPLORER_BASE_PATH || process.cwd(), 'certificates')

async function ensureCertDirExists() {
  try {
    await fs.access(CERT_DIR)
  } catch {
    await fs.mkdir(CERT_DIR, { recursive: true })
  }
}

export async function createCertificate(formData: FormData) {
  const commonName = formData.get('commonName') as string
  const days = parseInt(formData.get('days') as string, 10)
  const isCA = formData.get('isCA') === 'true'
  const parentCert = formData.get('parentCert') as string | null

  let parentCertPem = undefined
  let parentKeyPem = undefined

  if (!isCA && parentCert) {
    const certPath = getCertificatePath(parentCert)
    const keyPath = getKeyPath(parentCert)
    parentCertPem = (await fs.readFile(certPath)).toString()
    parentKeyPem = (await fs.readFile(keyPath)).toString()
  }

  await ensureCertDirExists()

  await generateCertificateWithForge({
    commonName,
    days,
    isCA,
    parentCertPem,
    parentKeyPem,
    organization: formData.get('organization') as string,
    organizationalUnit: formData.get('organizationalUnit') as string,
    country: formData.get('country') as string,
    state: formData.get('state') as string,
    locality: formData.get('locality') as string,
    email: formData.get('email') as string,
  })

  return { success: true }
}
