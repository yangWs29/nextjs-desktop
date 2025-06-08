'use client'
import { ConfigProvider, theme, App } from 'antd'
import React from 'react'
import '@ant-design/v5-patch-for-react-19'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}
