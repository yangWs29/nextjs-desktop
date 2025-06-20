import { readDirectoryFilesAction } from '@/app/explorer/_utils/read-directory-files-action'
import path from 'path'
import { isImage } from '@/app/explorer/_utils/util'
import { ImagePreviewProvider } from '@/app/explorer/image-preview-context'
import FileListItem from '@/app/explorer/_components/file-list/file-list-item'
import { cookies } from 'next/headers'
import { ScrollContainer } from '@/app/explorer/_components/scroll-container'

const FileList = async ({ currentPath = '' }: { currentPath: string }) => {
  const files = await readDirectoryFilesAction({ dirPath: currentPath })

  // 从 cookie 中读取 zoomLevel 数据
  const zoomLevel = Number((await cookies()).get('zoomLevel')?.value || 1)

  return (
    <ScrollContainer>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${120 * zoomLevel}px, 1fr))`,
          gap: 10,
          flex: 1,
        }}
      >
        <ImagePreviewProvider
          images={files.filter((file) => isImage(file.name)).map((file) => path.join(file.dirPath, file.name))}
        >
          <FileListItem files={files} currentPath={currentPath} />
        </ImagePreviewProvider>
      </div>
    </ScrollContainer>
  )
}

export default FileList
