'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function setHiddenFilesAction(hide_files_type: 'true' | 'false') {
  const cookieStore = await cookies()

  cookieStore.set('hide_hidden_files', hide_files_type, {
    path: '/explorer',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })

  // 触发路径重新验证（SSG/ISR）
  revalidatePath('/explorer')

  return { success: true }
}
