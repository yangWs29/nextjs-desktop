import { Flex } from 'antd'
import { FileOutlined, FileZipOutlined, FolderOpenOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { File } from '@/app/explorer/utils/read-directory-files'
import path from 'path'
import { ImageItem } from '@/app/explorer/image-preview-context'
import { isImage } from '@/app/explorer/utils/util'
import { videoExtensionPattern } from '@/app/explorer/media/media-utils'
import { isArchiveFile } from '@/app/explorer/utils/is-archive-file'
import { formatFileSize } from '@/app/explorer/utils/file-utils'
import React from 'react'

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
      {!file.isDirectory && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1,
            backgroundColor: 'rgba(14,14,14,0.3)',
            borderRadius: '4px', // 添加圆角
            padding: '2px 4px', // 可选：增加内边距使文字不贴边
          }}
        >
          {formatFileSize(file.size)}
        </span>
      )}
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
          {videoExtensionPattern.test(file.name) ? (
            <VideoCameraOutlined style={{ fontSize: '30px', marginBottom: '8px' }} />
          ) : isArchiveFile(file.name) ? (
            <FileZipOutlined style={{ fontSize: '30px', marginBottom: '8px' }} />
          ) : (
            <FileOutlined style={{ fontSize: '30px', marginBottom: '8px' }} />
          )}
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
