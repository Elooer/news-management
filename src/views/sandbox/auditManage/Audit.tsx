import { useEffect, useState } from 'react'
import { Table, notification, Button } from 'antd'
import axios from 'axios'

export default function Audit() {
  const [dataSource, setDataSource] = useState<any>([])
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem('news_token') || ''
  )
  useEffect(() => {
    axios
      .get(`http://localhost:5000/news?auditState=1_expand=category`)
      .then(res => {
        const list = res.data
        setDataSource(
          roleId === 1
            ? list
            : [
                ...list.filter((item: any) => item.author === username),
                ...list.filter(
                  (item: any) => item.region === region && roleId === 3
                ),
              ]
        )
      })
  }, [])
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
      render: (category: any) => {
        return <div>{category}</div>
      },
    },
    {
      title: '操作',
      render: (item: any) => {
        return (
          <div>
            <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        )
      },
    },
  ]

  const handleAudit = (item: any, auditState: number, publishState: number) => {
    setDataSource(dataSource.filter((data: any) => data.id !== item.id))
    axios
      .patch(`http://localhost:5000/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then(res => {
        notification.info({
          message: `通知`,
          description: '您可以到审核列表中查看您的文章',
          placement: 'bottomRight',
        })
      })
  }

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
