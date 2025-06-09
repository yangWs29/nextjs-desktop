import { Progress, Space } from 'antd'
import { formatFileSize } from '@/app/explorer/utils/file-utils'
import { checkDiskUsage } from '@/app/explorer/utils/disk'

const HardDiskCapacity = async ({ currentPath = '' }: { currentPath: string }) => {
  const { total, free } = await checkDiskUsage(currentPath)

  return (
    <Space style={{ width: '100%' }}>
      <Space>
        <span style={{ color: '#666' }}>已使用</span>
        <span>{formatFileSize(total - free)}</span>
      </Space>
      <Progress
        percent={Number((((total - free) / total) * 100).toFixed(2))}
        status="active"
        style={{ width: '100px' }}
      />
      <div style={{ color: '#666' }}>
        {formatFileSize(free)} free of {formatFileSize(total)}
      </div>
    </Space>
  )
}

export default HardDiskCapacity
