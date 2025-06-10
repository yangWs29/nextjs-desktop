import { Progress, Space } from 'antd'
import { formatFileSize } from '@/app/explorer/utils/file-utils'

const HardDiskCapacity = ({
  diskUsage: { total, free },
}: {
  diskUsage: {
    total: number
    free: number
  }
}) => {
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
