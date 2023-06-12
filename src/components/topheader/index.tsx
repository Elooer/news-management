import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { changeCollapsed } from '../../store/reducers/collapsedReducer'
import type { RootState } from '../../store'
import { Layout, theme, Button, Dropdown, Avatar } from 'antd'
import type { MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Header } = Layout

export default function TopHeader() {
  const collapsed = useSelector((state: RootState) => state.collapsed.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem('news_token') as string)

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          {roleName}
        </a>
      ),
    },
    {
      key: '4',
      danger: true,
      label: '退出',
      onClick: () => {
        localStorage.removeItem('news_token')
        navigate('/login')
      },
    },
  ]
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(changeCollapsed())}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来
        </span>
        <Dropdown menu={{ items }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
