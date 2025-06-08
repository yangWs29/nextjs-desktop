import React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'antd/dist/reset.css'

export const metadata: Metadata = {
  title: 'desktop',
  description: 'desktop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
