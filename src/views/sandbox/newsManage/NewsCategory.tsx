import React, { useState, useEffect, useContext, useRef } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import type { InputRef } from 'antd'
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import type { FormInstance } from 'antd/es/form'
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

const EditableContext = React.createContext<FormInstance<any> | null>(null)

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState<any>([])

  useEffect(() => {
    axios.get('/categories').then(res => {
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
    setDataSource(dataSource.filter((data: ItemType) => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  const handleSave = (record: any) => {
    setDataSource(
      dataSource.map((item: any) => {
        if (item.id === record.id) {
          return {
            id: item.id,
            title: record.title,
            value: record.title,
          }
        }
        return item
      })
    )
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title,
    })
  }

  interface DataType {
    key: React.Key
    name: string
    age: string
    address: string
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record: DataType) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
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
          </div>
        )
      },
    },
  ]
  interface EditableRowProps {
    index: number
  }
  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  interface Item {
    key: string
    name: string
    age: string
    address: string
  }

  interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (record: Item) => void
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!
    useEffect(() => {
      if (editing) {
        inputRef.current!.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()

        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
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
