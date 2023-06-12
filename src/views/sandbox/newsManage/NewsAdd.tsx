import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import style from './index.module.scss'
import axios from 'axios'
import NewsEditor from '../../../components/newsEditor'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const formRef = useRef<any>(null)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('news_token') || '')

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  interface FormItf {
    title: string
    categoryId: number
  }

  const handleNext = () => {
    if (current === 0) {
      formRef.current
        .validateFields()
        .then((res: FormItf) => {
          setFormInfo(res)
          setCurrent(current + 1)
        })
        .catch((err: Error) => {
          console.log(err)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻信息不能为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = (auditState: number) => {
    axios
      .post('/news', {
        ...formInfo,
        content: content,
        region: user.region ? user.region : '全球',
        author: user.username,
        roleId: user.roleId,
        auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        // publishTime: 0,
      })
      .then((res: any) => {
        navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? '草稿箱' : '审核列表'
          }中查看您的新闻`,
          placement: 'bottomRight',
        })
      })
  }

  return (
    <div>
      <PageHeader title="撰写新闻"></PageHeader>
      <Steps
        current={1}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主体内容',
            subTitle: 'Left 00:00:08',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            ref={formRef}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Select style={{ width: 120 }} options={categoryList} />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor
            getContent={(value: any) => {
              setContent(value)
            }}
            content={content}
          />
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存到草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}
