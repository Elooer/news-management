import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Button, notification } from 'antd'

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem('news_token') as string)
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then(res => {
        setDataSource(res.data)
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState: any) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      },
    },
    {
      title: '操作',
      render: (item: any) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button danger onClick={() => handleRevert(item)}>
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button type="primary" onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const handleRevert = (item: any) => {
    setDataSource(dataSource.filter((data: any) => data.id !== item.id))
    axios
      .patch(`http://localhost:5000/news/${item.id}`, {
        auditState: 0,
      })
      .then((res: any) => {
        notification.info({
          message: `通知`,
          description: '您可以到草稿箱中查看您的文章',
          placement: 'bottomRight',
        })
      })
  }

  const handleUpdate = (item: any) => {
    navigate(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item: any) => {
    axios
      .patch(`http://localhost:5000/news/${item.id}`, {
        publishState: 2,
      })
      .then((res: any) => {
        navigate('/publish-manage/published')
        notification.info({
          message: `通知`,
          description: `您可以到[发布管理/已发布]中查看您的新闻`,
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
