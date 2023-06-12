import { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/userform'

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
  const [dataSource, setDataSource] = useState<any>([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [roleList, setRoleList] = useState<any[]>([])
  const [regionList, setRegionList] = useState<any[]>([])
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState<any>({})
  const addForm = useRef<any>(null)
  const updateForm = useRef<any>(null)

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem('news_token') || ''
  )

  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(
        roleId === 1
          ? list
          : [
              ...list.filter((item: any) => item.username === username),
              ...list.filter(
                (item: any) => item.region === region && roleId === 3
              ),
            ]
      )
    })
  }, [])

  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoleList(res.data)
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
    setDataSource(dataSource.filter((data: ItemType) => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  const handleChange = (item: any) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    })
  }

  const handleUpdate = (item: any) => {
    setIsUpdateVisible(true)
    // 解决异步队列问题
    setTimeout(() => {
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    setCurrent(item)
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({ text: item.title, value: item.value })),
        { text: '全球', value: '全球' },
      ],
      onFilter: (value: any, item: any) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region: any) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role: any) => {
        return role.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (key: any) => {
        return key
      },
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState: any, item: any) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        )
      },
    },
    {
      title: '操作',
      render: (item: any) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={item.default}
              onClick={() => confirmMethod(item)}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            />
          </div>
        )
      },
    },
  ]

  const addFormOk = () => {
    addForm.current
      ?.validateFields()
      .then((value: any) => {
        setIsAddVisible(false)
        addForm.current.resetFields()
        axios
          .post('/users', {
            ...value,
            roleState: true,
            default: false,
          })
          .then(res => {
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter(item => item.id === value.roleId)[0],
              },
            ])
          })
        setDataSource([...dataSource])
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then((value: any) => {
      setIsUpdateVisible(false)
      setDataSource(
        dataSource.map((item: any) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter(data => data.id === value.roleId)[0],
            }
          }
          return item
        })
      )
      setIsUpdateDisabled(!isUpdateDisabled)
      console.log('current', current)
      axios.patch(`/users/${current.id}`, value)
    })
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsAddVisible(true)
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item: any) => item.id}
      />
      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>
      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
        />
      </Modal>
    </div>
  )
}
