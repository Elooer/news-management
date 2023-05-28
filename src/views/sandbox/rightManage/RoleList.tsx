import { useState, useEffect } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

interface RoleType {
  id: number
  roleName: string
  roleType: number
  rights: string[]
}

interface ItemType {
  id: number
  grade: number
  rightId?: number
  pagepermisson?: number
  key: React.ReactNode
  label?: string
  title?: string
  children?: ItemType[]
}

export default function RoleList() {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState<string[]>([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res: any) => {
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:5000/brights?_embed=bchildren')
      .then((res: any) => {
        const newData = [...res.data]
        newData.map(item => {
          item['children'] = [...item.bchildren]
          delete item.bchildren
        })
        setRightList(newData as any)
      })
  }, [])

  const confirmMethod = (item: RoleType) => {
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

  const deleteMethod = (item: RoleType) => {
    setDataSource(dataSource.filter((data: RoleType) => data.id !== item.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
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
      title: '角色名称',
      dataIndex: 'roleName',
      render: (id: any) => {
        return <b>{id}</b>
      },
    },
    {
      title: '操作',
      render: (item: RoleType) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
            />
          </div>
        )
      },
    },
  ]

  const handleOk = () => {
    setIsModalOpen(false)
    setDataSource(
      dataSource.map(item => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          }
        }
        return item
      })
    )
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights,
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onCheck = (checkedKeys: any) => {
    setCurrentRights(checkedKeys.checked)
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item: any) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
