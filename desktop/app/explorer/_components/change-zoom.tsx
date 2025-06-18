'use client'
import { Slider } from 'antd'
import { changeZoomLevel } from '@/app/explorer/actions'

export default function ZoomSlider({ zoomLevel }: { zoomLevel: number }) {
  return (
    <Slider
      style={{ width: '120px' }}
      min={1.0}
      max={4}
      step={0.8}
      value={zoomLevel}
      onChange={(value) => {
        return changeZoomLevel(value)
      }}
    />
  )
}
