'use client'
import { Progress, Space } from 'antd'
import { formatFileSize, replaceDir } from '@/app/explorer/utils/file-utils'
import { checkDiskUsageAction } from '@/app/explorer/actions'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const HardDiskCapacity = () => {
  const pathname = usePathname()
  const [diskUsage, setDiskUsage] = useState({ total: 0, free: 0 })

  useEffect(() => {
    async function fetchDiskUsage() {
      if (pathname) {
        const data = await checkDiskUsageAction(replaceDir(pathname))
        setDiskUsage(data)
      }
    }

    fetchDiskUsage().then()
  }, [pathname])

  const { total, free } = diskUsage
  const used = total - free

  return (
    <Space style={{ width: '100%' }}>
      <Space>
        <span style={{ color: '#666' }}>已使用</span>
        <span>{formatFileSize(used)}</span>
      </Space>
      <Progress percent={Number(((used / total) * 100).toFixed(2))} status="active" style={{ width: '100px' }} />
      <div style={{ color: '#666' }}>
        {formatFileSize(free)} free of {formatFileSize(total)}
      </div>
    </Space>
  )
}

export default HardDiskCapacity
