import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Modal, notification } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

interface ItemType {
  id: number
  grade: number
  rightId?: number
  pagepermisson?: number
  key: React.ReactNode
  label: string
  children?: ItemType[]
}

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('news_token') as string)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/news?author=${username}&auditState=0&_expand=category`
      )
      .then(res => {
        const list = res.data
        setDataSource(list)
      })
  }, [])

  const confirmMethod = (item: ItemType) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const handleCheck = (id: number) => {
    axios
      .patch(`http://localhost:5000/news/${id}`, {
        auditState: 1,
      })
      .then((res: any) => {
        navigate('/audit-manage/list')
        notification.info({
          message: `通知`,
          description: '您可以到审核列表中查看您的文章',
          placement: 'bottomRight',
        })
      })
  }

  const deleteMethod = (item: ItemType) => {
    console.log(item.id)
    setDataSource(dataSource.filter((data: ItemType) => data.id !== item.id))
    axios.delete(`http://localhost:5000/news/${item.id}`)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: any) => {
        return <b>{id}</b>
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title: string, item: any) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
    },
    {
      title: '操作',
      render: (item: ItemType) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/news-manage/update/${item.id}`)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        )
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
