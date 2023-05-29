import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from 'react-particles'
import './index.scss'
import { options } from './particles.config'
import { loadFull } from 'tsparticles'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()

  // 粒子效果的回调
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: any) => {}, [])
  const onFinish = (values: any) => {
    console.log(values)
    axios
      .get(
        `http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then(res => {
        if (res.data.length === 0) {
        } else {
          localStorage.setItem('news_token', JSON.stringify(res.data[0]))
          navigate('/home')
        }
      })
  }

  return (
    <div style={{ background: 'rgb(35, 39, 65', height: '100%' }}>
      <Particles
        height={document.documentElement.clientHeight + ''}
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
      />
      <div className="form_container">
        <div className="login_title">新闻发布管理系统</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
