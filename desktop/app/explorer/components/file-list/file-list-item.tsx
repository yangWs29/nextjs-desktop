import { Card } from 'antd'
import { FileItemCheckbox } from '@/app/explorer/more-context'
import path from 'path'
import { FileItemIcon } from '@/app/explorer/components/file-list/file-item-icon'
import Link from 'next/link'
import { File } from '@/app/explorer/utils/read-directory-files-action'
import MoreActionsModal from '@/app/explorer/components/more-action/more-actions-modal'
import React from 'react'
import { isPlayableVideo } from '@/app/explorer/media/media-utils'
import { app_config } from '@/app-config.mjs'
import { dirJoinAndEncode } from '@/app/explorer/utils/file-utils'

const FileListItem = ({ files, currentPath }: { files: File[]; currentPath: string }) => {
  return files.map((file, index) => {
    const CardItem = () => (
      <Card
        style={{ overflow: 'hidden' }}
        styles={{
          body: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '5px 5px 5px 5px',
          },
        }}
        cover={<FileItemIcon {...file} />}
      >
        <div
          title={file.name}
          style={{
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            wordWrap: 'break-word',
          }}
        >
          {file.isDirectory ? (
            file.name
          ) : (
            <Link
              href={dirJoinAndEncode('/explorer/static/', file.dirPath, file.name)}
              target="_blank"
              prefetch={false}
            >
              {file.name}
            </Link>
          )}
        </div>
      </Card>
    )

    return (
      <div key={index} style={{ position: 'relative' }}>
        <MoreActionsModal currentPath={currentPath} file={file} baseDir={app_config.explorer_base_path} />
        <FileItemCheckbox hrefDir={path.join(currentPath || 'explorer', file.name)} />

        {file.isDirectory ? (
          <Link href={dirJoinAndEncode('/explorer', currentPath, file.name)}>
            <CardItem />
          </Link>
        ) : isPlayableVideo(file.name) ? (
          <Link href={dirJoinAndEncode('/explorer/media', currentPath, file.name)}>
            <CardItem />
          </Link>
        ) : (
          <CardItem />
        )}
      </div>
    )
  })
}

export default FileListItem
