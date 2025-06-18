import forge from 'node-forge'
import fs from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

const CERT_DIR = path.join(process.env.EXPLORER_BASE_PATH || process.cwd(), 'certificates')

export function getCertificatePath(certName: string) {
  return path.join(getCertificateDir(certName), `${certName}.crt`)
}

export function getKeyPath(certName: string) {
  return path.join(getCertificateDir(certName), `${certName}.key`)
}

function ensureCertificateDirectoryExists(certName?: string) {
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true })
  }
  if (certName) {
    const certDir = getCertificateDir(certName)
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true })
    }
  }
}

interface CertificateOptions {
  commonName: string
  organization?: string
  organizationalUnit?: string
  country?: string
  state?: string
  locality?: string
  email?: string
  days: number
  isCA: boolean
  parentCertPem?: string
  parentKeyPem?: string
}

function getCertificateDir(certName: string) {
  const baseName = path.basename(certName, '.crt')
  return path.join(CERT_DIR, baseName)
}

export async function generateCertificateWithForge(
  options: CertificateOptions,
): Promise<{ certPath: string; keyPath: string }> {
  const { commonName, days, isCA, parentCertPem, parentKeyPem } = options

  // 构建 subject
  const attrs = [
    { name: 'commonName', value: commonName },
    { name: 'countryName', value: options.country || 'CN' },
    { name: 'stateOrProvinceName', value: options.state || 'Beijing' },
    { name: 'localityName', value: options.locality || 'Beijing' },
    { name: 'organizationName', value: options.organization || 'MyOrg' },
    { name: 'organizationalUnitName', value: options.organizationalUnit || 'IT' },
    { name: 'emailAddress', value: options.email || 'admin@example.com' },
  ]

  // 生成密钥对
  const keys = forge.pki.rsa.generateKeyPair(2048)
  const cert = forge.pki.createCertificate()

  cert.publicKey = keys.publicKey
  cert.serialNumber = randomBytes(16).toString('hex')
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + days)
  cert.setSubject(attrs)
  cert.setIssuer(isCA ? attrs : forge.pki.certificateFromPem(parentCertPem!).subject.attributes)
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: isCA,
      ...(isCA && { pathLenConstraint: 5 }),
    },
    {
      name: 'keyUsage',
      keyCertSign: isCA,
      digitalSignature: !isCA,
      nonRepudiation: true,
      keyEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
    },
    {
      name: 'subjectAltName',
      altNames: [{ type: 2, value: commonName }],
    },
  ])

  if (isCA) {
    cert.setIssuer(attrs)
    cert.sign(keys.privateKey, forge.md.sha256.create())
  } else {
    cert.sign(forge.pki.privateKeyFromPem(parentKeyPem!), forge.md.sha256.create())
  }

  const certPem = forge.pki.certificateToPem(cert)
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey)

  const certDir = getCertificateDir(commonName)
  ensureCertificateDirectoryExists(commonName)

  const certPath = path.join(certDir, `${commonName}.crt`)
  const keyPath = path.join(certDir, `${commonName}.key`)

  fs.writeFileSync(certPath, certPem)
  fs.writeFileSync(keyPath, keyPem)

  console.log(`Certificate generated: ${certPath}`)
  console.log(`Key generated: ${keyPath}`)

  return { certPath, keyPath }
}

export function listCertificates() {
  ensureCertificateDirectoryExists()
  return fs
    .readdirSync(CERT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const certName = dirent.name
      const certPath = path.join(CERT_DIR, certName, `${certName}.crt`)
      if (fs.existsSync(certPath)) {
        return certName
      }
      return null
    })
    .filter(Boolean) as string[]
}

// 新增函数：读取证书内容
export function readCertificate(certName: string): string {
  const certPath = path.join(CERT_DIR, certName)
  return fs.readFileSync(certPath, 'utf-8')
}

// 新增函数：删除证书及对应私钥
export function deleteCertificate(certName: string) {
  const certDir = path.join(CERT_DIR, path.basename(certName, '.crt'))
  if (fs.existsSync(certDir)) {
    fs.rmSync(certDir, { recursive: true, force: true })
  }
}

// 新增函数：读取并解析证书详细信息
export function parseCertificate(certPem: string) {
  const cert = forge.pki.certificateFromPem(certPem)

  return {
    issuer: formatDn(cert.issuer.attributes),
    subject: formatDn(cert.subject.attributes),
    notBefore: cert.validity.notBefore.toISOString(),
    notAfter: cert.validity.notAfter.toISOString(),
    serialNumber: cert.serialNumber,
  }
}

// 辅助函数：格式化 DN 字段
function formatDn(attrs: any[]) {
  return attrs.map((attr) => `${forge.pki.oids[attr.shortName] || attr.shortName}=${attr.value}`).join(', ')
}

// 新增：读取整个证书链
export function getCertificateChain(certName: string): string[] {
  const chain: string[] = []
  let currentCertName = certName

  while (currentCertName) {
    const certPath = getCertificatePath(currentCertName)
    const certPem = fs.readFileSync(certPath, 'utf-8')
    const cert = forge.pki.certificateFromPem(certPem)

    chain.push(currentCertName)

    // 如果是 CA 证书，则为链的终点
    if (cert.subject.hash === cert.issuer.hash) {
      break
    }

    // 查找 issuer 对应的上级证书
    const issuerCommonName = cert.issuer.attributes.find((a) => a.shortName === 'CN')?.value
    if (!issuerCommonName) break

    const issuerCertName = String(issuerCommonName).replace(/\s+/g, '_')
    const issuerCertPath = getCertificatePath(issuerCertName)

    if (!fs.existsSync(issuerCertPath)) break

    currentCertName = issuerCertName
  }

  return chain
}

// 新增：生成 PFX (.pfx/.p12) 文件
// 修改后的 generatePfx 函数
export function generatePfx(certName: string, password: string = '123456'): Buffer {
  const certPath = getCertificatePath(certName)
  const keyPath = getKeyPath(certName)

  const certPem = fs.readFileSync(certPath, 'utf-8')
  const keyPem = fs.readFileSync(keyPath, 'utf-8')

  const cert = forge.pki.certificateFromPem(certPem)
  const key = forge.pki.privateKeyFromPem(keyPem)

  const certBagAttrs = [
    {
      name: 'localKeyId',
      value: forge.pki.getPublicKeyFingerprint(cert.publicKey, { md: forge.md.sha1.create() }),
    },
    {
      name: 'friendlyName',
      value: cert.subject.getField('CN')?.value || 'Certificate',
    },
  ]

  const keyBagAttrs = [
    {
      name: 'localKeyId',
      value: forge.pki.getPublicKeyFingerprint(cert.publicKey, { md: forge.md.sha1.create() }),
    },
  ]

  const options = {
    algorithm: '3des' as const, // 修改为符合类型要求的枚举值
    certBags: [
      {
        bagAttrs: certBagAttrs,
        bagContents: forge.pki.certificateToAsn1(cert),
      },
    ],
    keyBags: [
      {
        bagAttrs: keyBagAttrs,
        bagContents: key,
      },
    ],
  }
  // 合并参数为正确数量
  const pkcs12Asn1 = forge.pkcs12.toPkcs12Asn1(key, [cert], password, options)

  const derBytes = forge.asn1.toDer(pkcs12Asn1).getBytes()
  return Buffer.from(derBytes, 'binary')
}
