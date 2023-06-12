import { Button } from 'antd'
import NewsPublish from '../../../components/newsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3)
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id: number) => (
          <Button type="primary" onClick={() => handleDelete(id)}>
            删除
          </Button>
        )}
      />
    </div>
  )
}
