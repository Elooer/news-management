import { Button } from 'antd'
import NewsPublish from '../../../components/newsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1)
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id: number) => (
          <Button type="primary" onClick={() => handlePublish(id)}>
            发布
          </Button>
        )}
      />
    </div>
  )
}
