import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import axios from 'axios'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import filterMenu from '../../utils/filterMenu'
import './index.scss'
const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const menuList: MenuItem[] = [
  {
    key: '/home',
    label: '首页',
    icon: <UserOutlined />,
  },
  {
    key: 'user-manage',
    label: '用户管理',
    icon: <UserOutlined />,
    children: [
      {
        key: 'user-manage/list',
        label: '用户列表',
        icon: <UserOutlined />,
      },
    ],
  },
  {
    key: 'right-manage',
    label: '权限管理',
    icon: <UserOutlined />,
    children: [
      {
        key: 'right-manage/role/list',
        label: '角色列表',
        icon: <UserOutlined />,
      },
      {
        key: 'right-manage/right/list',
        label: '权限列表',
        icon: <UserOutlined />,
      },
    ],
  },
]

export default function SideMenu() {
  const collapsed = useSelector((state: RootState) => state.collapsed.value)
  const [menu, setMenu] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const selectKey = location.pathname
  const openKeys = ['/' + location.pathname.split('/')[1]]

  useEffect(() => {
    axios.get('/rights?_embed=children').then((res: any) => {
      const data: any = filterMenu(res.data)
      setMenu(data)
    })
  }, [])

  const selectMenu = ({ key }: any) => {
    navigate(key)
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">新闻发布管理系统</div>
        {/* <div className="demo-logo-vertical" /> */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectKey]}
            defaultOpenKeys={openKeys}
            items={menu}
            onSelect={selectMenu}
          />
        </div>
      </div>
    </Sider>
  )
}
