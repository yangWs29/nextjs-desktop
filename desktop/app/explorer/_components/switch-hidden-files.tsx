'use client'
import { Switch } from 'antd'
import { setHiddenFilesAction } from '@/app/explorer/_components/set-hidden-files-action'

const SwitchHiddenFiles = ({ initialHiddenFiles = true }: { initialHiddenFiles: boolean }) => {
  return (
    <Switch
      checkedChildren="隐藏"
      unCheckedChildren="显示"
      value={initialHiddenFiles}
      onChange={(checked) => {
        return setHiddenFilesAction(checked ? 'true' : 'false')
      }}
    />
  )
}

export default SwitchHiddenFiles
