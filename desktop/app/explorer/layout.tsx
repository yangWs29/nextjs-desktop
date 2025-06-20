import React from 'react'
import { Card, Divider, Flex, Space } from 'antd'
import ExplorerBreadcrumb from '@/app/explorer/_components/explorer-breadcrumb'
import { ActionsBtn, EditProvider } from '@/app/explorer/more-context'
import { TerminalProvider } from '@/app/explorer/_components/terminal/terminal-context'
import HardDiskCapacity from '@/app/explorer/_components/hard-disk-capacity'
import { ChangeSortServer } from '@/app/explorer/_components/change-sort'
import { cookies, headers } from 'next/headers'
import { checkDiskUsageAction } from '@/app/explorer/actions'
import { replaceDir } from '@/app/explorer/_utils/file-utils'
import SwitchHiddenFiles from '@/app/explorer/_components/switch-hidden-files'
import {
  getHideHiddenOptionFromCookie,
  getSortOptionFromCookie,
} from '@/app/explorer/_utils/get-hide-hidden-option-from-cookie'
import DirTree from '@/app/explorer/_components/dir-tree'
import ZoomSlider from '@/app/explorer/_components/change-zoom'

async function FooterItem() {
  const headerList = await headers()

  return (
    <>
      <Divider
        style={{
          flexShrink: 0,
        }}
      />
      <Space
        style={{
          width: '100%',
          height: '20px',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <HardDiskCapacity diskUsage={await checkDiskUsageAction(replaceDir(headerList.get('x-pathname') || '/'))} />

        <ChangeSortServer initialSort={await getSortOptionFromCookie()} />

        <SwitchHiddenFiles initialHiddenFiles={await getHideHiddenOptionFromCookie()} />

        <ZoomSlider zoomLevel={Number((await cookies()).get('zoomLevel')?.value || 1)} />
      </Space>
    </>
  )
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
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
          style={{ height: '100vh', borderRadius: 0, display: 'flex', flexDirection: 'column' }}
          styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' } }}
        >
          <Flex
            style={{
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <DirTree />

            {children}
          </Flex>

          <FooterItem />
        </Card>
      </TerminalProvider>
    </EditProvider>
  )
}

export default Layout
