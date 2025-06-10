'use client' // 注意：虽然使用 'use client'，但逻辑在 Server Component 中处理

import React, { useState } from 'react'
import { Select } from 'antd'
import { SortOptionType } from '@/app/explorer/utils/read-directory-files'
import { setSortCookieAction } from '@/app/explorer/components/set-sort-cookie-action'

const SORT_OPTIONS = [
  { value: 'name-asc', label: '文件名 A-Z' },
  { value: 'name-desc', label: '文件名 Z-A' },
  { value: 'date-asc', label: '创建时间 旧→新' },
  { value: 'date-desc', label: '创建时间 新→旧' },
  { value: 'size-asc', label: '文件大小 小→大' },
  { value: 'size-desc', label: '文件大小 大→小' },
]

type ChangeSortProps = {
  initialSort?: SortOptionType
}

export const ChangeSortServer: React.FC<ChangeSortProps> = ({ initialSort = 'name-asc' }) => {
  const [currentSort, setCurrentSort] = useState<SortOptionType>(initialSort)

  const handleChange = async (value: SortOptionType) => {
    setCurrentSort(value)
    await setSortCookieAction(value)
    window.location.reload()
  }

  return (
    <Select
      value={currentSort}
      onChange={handleChange}
      options={SORT_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      }))}
      style={{ width: 200 }}
    />
  )
}
