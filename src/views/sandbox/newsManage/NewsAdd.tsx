import { useState, useEffect, useRef } from 'react'
import { Steps, Button, Form, Input, Select } from 'antd'
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

  useEffect(() => {
    axios.get('http://localhost:5000/categories').then(res => {
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
      setCurrent(current + 1)
    }
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
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
          />
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary">保存到草稿箱</Button>
            <Button danger>提交审核</Button>
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
