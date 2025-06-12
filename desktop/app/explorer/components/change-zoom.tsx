'use client'
import { Slider } from 'antd'
import { changeZoomLevel } from '@/app/explorer/actions'

export default async function ZoomSlider({ zoomLevel }: { zoomLevel: number }) {
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
      value={zoomLevel}
      onChange={(value) => {
        return changeZoomLevel(value)
      }}
    />
  )
}
