import React from 'react'
import { Outlet } from 'react-router-dom'
import TopHeader from '../../components/topheader'
import SideMenu from '../../components/sidemenu'
import { Layout, theme } from 'antd'
const { Content } = Layout
import './index.scss'

export default function Sandbox() {
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
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
