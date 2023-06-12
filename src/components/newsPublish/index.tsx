import { Table } from 'antd'

interface Props {
  dataSource: any
  button: Function
}

export default function NewsPublish(props: Props) {
  const { dataSource, button } = props

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title: any, item: any) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'categoryId',
      render: (categoryId: string) => {
        return <div>{categoryId}</div>
      },
    },
    {
      title: '操作',
      render: (item: any) => {
        return <div>{button(item.id)}</div>
      },
    },
  ]

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
