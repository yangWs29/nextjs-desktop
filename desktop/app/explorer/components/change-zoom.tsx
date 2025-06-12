'use client'

import { useState } from 'react'
import { Slider } from 'antd'
import { changeZoomLevel } from '@/app/explorer/actions'

export default function ZoomSlider() {
  const [value, setValue] = useState(1) // 初始值为 1.2

  const handleChange = async (newValue: number) => {
    setValue(newValue)
    await changeZoomLevel(newValue) // 调用 server action 更新 cookie
  }

  return (
    <Slider
      style={{ width: '120px' }}
      min={1.0}
      max={3.0}
      step={0.4}
      marks={{
        1.4: '1.4',
        1.8: '1.8',
        2.2: '2.2',
        2.6: '2.6',
        3.0: '3.0',
      }}
      value={value}
      onChange={handleChange}
    />
  )
}
