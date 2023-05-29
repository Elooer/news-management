import { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

interface Props {
  regionList: any[]
  roleList: any[]
  isUpdateDisabled?: any
}

interface Options {
  value: string
  label: string
}

const UserForm = forwardRef((props: Props, ref: any) => {
  const { regionList, roleList, isUpdateDisabled } = props
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  useEffect(() => {
    setIsDisabled(isUpdateDisabled)
  }, [isUpdateDisabled])

  const getRoleOptions = (): Options[] => {
    const options: Options[] = []
    roleList.forEach((item: any) => {
      options.push({ value: item.id, label: item.roleName })
    })
    return options
  }

  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={
            isDisabled
              ? []
              : [
                  {
                    required: true,
                    message: 'Please input the title of collection!',
                  },
                ]
          }
        >
          <Select
            disabled={isDisabled}
            onChange={() => {}}
            style={{ width: '100%' }}
            options={regionList}
          />
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Select
            onChange={(value: number) => {
              if (value === 1) {
                setIsDisabled(true)
                ref.current.setFieldsValue({
                  region: '',
                })
              } else {
                setIsDisabled(false)
              }
            }}
            style={{ width: '100%' }}
            options={getRoleOptions()}
          />
        </Form.Item>
      </Form>
    </div>
  )
})

export default UserForm
