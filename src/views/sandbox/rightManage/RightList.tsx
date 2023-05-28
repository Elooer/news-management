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

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach((item: any) => {
        item.children.length === 0 && (item.children = '')
      })
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
      title: 'ID',
      dataIndex: 'id',
      render: (id: any) => {
        return <b>{id}</b>
      },
    },
    {
      title: '权限名称',
      dataIndex: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key: any) => {
        return <Tag color="orange">{key}</Tag>
      },
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
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson ? true : false}
                    onChange={() => switchMethod(item)}
                  ></Switch>
                </div>
              }
              title="配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
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
      />
    </div>
  )
}
