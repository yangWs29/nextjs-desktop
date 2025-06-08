import React from 'react'
import { Card, Space } from 'antd'
import ExplorerBreadcrumb from '@/app/explorer/explorer-breadcrumb'
import { ActionsBtn, EditProvider } from '@/app/explorer/edit-context'
import { TerminalProvider } from '@/app/explorer/terminal-context'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EditProvider>
      <TerminalProvider>
        <Card
          title={<ExplorerBreadcrumb />}
          extra={
            <Space>
              <ActionsBtn />
            </Space>
          }
          style={{ height: '100vh', borderRadius: 0 }}
        >
          {children}
        </Card>
      </TerminalProvider>
    </EditProvider>
  )
}

export default Layout
