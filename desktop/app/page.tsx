import { Card } from 'antd'
import CurrentTime from '@/components/CurrentTime'
import AppList from '@/components/AppList'

export default () => (
  <Card
    extra={<CurrentTime />}
    style={{
      borderRadius: 0,
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      width: '100vw',
      flexDirection: 'column',
    }}
    styles={{ body: { display: 'flex', flex: 1 } }}
  >
    <AppList />
  </Card>
)
