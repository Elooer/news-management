import { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
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

export default function UserList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/users').then(res => {
      // const list = res.data
      // list.forEach((item: any) => {
      //   item.children.length === 0 && (item.children = '')
      // })
      setDataSource(res.data)
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

  const deleteMethod = (item: ItemType) => {
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data: ItemType) => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list: ItemType[] = dataSource.filter(
        (data: ItemType) => data.id === item.rightId
      )
      list[0].children = list[0].children?.filter(
        (data: ItemType) => data.id !== item.id
      )
      setDataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  const switchMethod = (item: ItemType) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    }
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region: any) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleId',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (key: any) => {
        return <Tag color="orange">{key}</Tag>
      },
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (key: any) => {
        return <Switch></Switch>
      },
    },
    {
      title: '操作',
      render: (item: ItemType) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} />

            <Button type="primary" shape="circle" icon={<EditOutlined />} />
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
        rowKey={(item: any) => item.id}
      />
    </div>
  )
}
