'use server'
import { cookies } from 'next/headers'
import { SortOptionType } from '@/app/explorer/utils/read-directory-files-action'

export const getHideHiddenOptionFromCookie = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies()
    const hideHidden = cookieStore.get('hide_hidden_files')?.value || 'true'

    if (hideHidden === 'true' || hideHidden === 'false') {
      return hideHidden === 'true'
    }
  } catch (e) {
    // 防止 client-only 环境报错
  }

  // 默认值：隐藏隐藏文件
  return true
}

// 从 cookie 获取排序规则
export const getSortOptionFromCookie = async (): Promise<SortOptionType> => {
  try {
    const cookieStore = await cookies()
    const sortCookie = cookieStore.get('file_sort')?.value

    if (
      sortCookie &&
      ['name-asc', 'name-desc', 'date-asc', 'date-desc', 'size-asc', 'size-desc'].includes(sortCookie)
    ) {
      return sortCookie as SortOptionType
    }
  } catch (e) {
    // 防止在 client-only 环件下报错
  }

  // 默认值
  return 'name-asc'
}
