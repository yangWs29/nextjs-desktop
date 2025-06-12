import React from 'react'
import { Card } from 'antd'
import Link from 'next/link'

const app_list = ['explorer', 'certificates']

const AppList = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'column', // 纵向优先排列
        gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))', // 每行列高自动调整
        gridAutoColumns: 'min-content', // 列宽根据内容自适应，不拉伸
        gap: '10px',
        flex: '1 0',
        overflowX: 'auto', // 如果列太多，允许横向滚动
        alignItems: 'start', // 内容顶部对齐
        alignContent: 'start', // 多列时整体靠左
        justifyContent: 'start', // 水平方向靠左
      }}
    >
      {app_list.map((app, index) => (
        <Link
          key={index}
          href={`/${app}/`}
          style={{
            width: '100px',
            aspectRatio: '1 / 1',
            display: 'flex',
            flexBasis: 0,
            flexShrink: 0,
          }}
        >
          <Card key={index} style={{ width: '100%' }}>
            {app}
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default AppList
