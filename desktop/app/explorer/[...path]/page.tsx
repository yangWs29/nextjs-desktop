import FileList from '@/app/explorer/components/file-list/file-list'

const Page = async ({ params }: { params: Promise<{ path?: string[] | undefined }> }) => {
  const { path } = await params

  const currentPath = path?.join('/') || ''

  return <FileList currentPath={currentPath} />
}

export default Page
