import React from 'react'
import { Card, Divider, Space } from 'antd'
import ExplorerBreadcrumb from '@/app/explorer/explorer-breadcrumb'
import { ActionsBtn, EditProvider } from '@/app/explorer/edit-context'
import { TerminalProvider } from '@/app/explorer/terminal-context'
import HardDiskCapacity from '@/app/explorer/hard-disk-capacity'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ path?: string[] | undefined }>
}) => {
  const { path } = await params

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
          style={{ minHeight: '100vh', borderRadius: 0, display: 'flex', flexDirection: 'column' }}
          styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
        >
          <div style={{ width: '100%', height: '100%', flex: 1 }}>{children}</div>
          <Divider />
          <Space
            style={{
              width: '100%',
              height: '20px',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HardDiskCapacity currentPath={path?.join('/') || '/'} />
          </Space>
        </Card>
      </TerminalProvider>
    </EditProvider>
  )
}

export default Layout
