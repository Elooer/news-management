import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import TopHeader from '../../components/topheader'
import SideMenu from '../../components/sidemenu'
import { Layout, theme } from 'antd'
const { Content } = Layout
import './index.scss'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export default function Sandbox() {
  Nprogress.start()
  useEffect(() => {
    Nprogress.done()
  })
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout>
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
