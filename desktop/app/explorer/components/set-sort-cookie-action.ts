'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { SortOptionType } from '@/app/explorer/utils/read-directory-files'

export async function setSortCookieAction(sort: SortOptionType) {
  const cookieStore = await cookies()

  cookieStore.set('file_sort', sort, {
    path: '/explorer',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })

  // 触发路径重新验证（SSG/ISR）
  revalidatePath('/explorer')

  return { success: true }
}
