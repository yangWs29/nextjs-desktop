import { readDirectoryFiles } from '@/app/explorer/read-directory-files'
import path from 'path'
import { isImage } from '@/app/explorer/util'
import { ImagePreviewProvider } from '@/app/explorer/image'
import FileListItem from '@/app/explorer/file-list-item'

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
        images={files
          .filter((file) => isImage(file.name))
          .map((file) => path.join(file.dirPath, encodeURIComponent(file.name)))}
      >
        <FileListItem files={files} currentPath={currentPath} />
      </ImagePreviewProvider>
    </div>
  )
}

export default FileList
