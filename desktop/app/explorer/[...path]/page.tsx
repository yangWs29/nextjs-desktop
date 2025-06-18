import FileList from '@/app/explorer/_components/file-list/file-list'

const Page = async ({ params }: { params: Promise<{ path?: string[] | undefined }> }) => {
  const { path } = await params

  const currentPath = decodeURIComponent(path?.join('/') || '')

  return <FileList currentPath={currentPath} />
}

export default Page
