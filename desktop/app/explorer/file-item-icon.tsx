import { Flex } from 'antd'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { File } from '@/app/explorer/read-directory-files'
import path from 'path'
import { ImageItem } from '@/app/explorer/image'
import { isImage } from '@/app/explorer/util'

export function FileItemIcon(file: File) {
  return (
    <Flex
      flex={1}
      style={{
        position: 'relative', // 关键定位
        width: '100%',
        aspectRatio: '4/5',
        marginBottom: 5,
        justifyContent: 'center',
      }}
    >
      {file.isDirectory ? (
        <FolderOpenOutlined style={{ fontSize: '30px', marginBottom: '8px' }} />
      ) : isImage(file.name) ? (
        <ImageItem file_path={path.join(file.dirPath, file.name)} />
      ) : (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FileOutlined style={{ fontSize: '30px', marginBottom: '8px' }} />
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              fontSize: '12px',
              color: '#666',
              pointerEvents: 'none',
            }}
          >
            {file.name.split('.').pop()}
          </span>
        </div>
      )}
    </Flex>
  )
}
