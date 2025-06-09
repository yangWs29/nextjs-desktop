import { readDirectoryFiles } from '@/app/explorer/utils/read-directory-files'
import path from 'path'
import { isImage } from '@/app/explorer/utils/util'
import { ImagePreviewProvider } from '@/app/explorer/image-preview-context'
import FileListItem from '@/app/explorer/components/file-list/file-list-item'

const FileList = async ({ currentPath = '' }: { currentPath: string }) => {
  const files = await readDirectoryFiles(currentPath)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 10,
      }}
    >
      <ImagePreviewProvider
        images={files.filter((file) => isImage(file.name)).map((file) => path.join(file.dirPath, file.name))}
      >
        <FileListItem files={files} currentPath={currentPath} />
      </ImagePreviewProvider>
    </div>
  )
}

export default FileList
