import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState<any>({})
  const params: any = useParams()
  const { id } = params
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/news/${id}?_expand=category&_expand=role`)
      .then(res => {
        console.log(res.data)
        setNewsInfo(res.data)
      })
  }, [])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black', 'orange', 'green', 'red']
  const descriptions = newsInfo.id
    ? [
        { label: '创建者', value: newsInfo.author },
        {
          label: '创建时间',
          value: moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss'),
        },
        {
          label: '发布时间',
          value: newsInfo.publishTime
            ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss')
            : '-',
        },
        {
          label: '区域',
          value: newsInfo.region,
        },
        {
          label: '审核状态',
          value: (
            <span style={{ color: colorList[newsInfo.auditState] }}>
              {auditList[newsInfo.auditState]}
            </span>
          ),
        },
        {
          label: '发布状态',
          value: (
            <span style={{ color: colorList[newsInfo.publishState] }}>
              {publishList[newsInfo.publishState]}
            </span>
          ),
        },
        {
          label: '访问数量',
          value: newsInfo.view,
        },
        {
          label: '点赞数量',
          value: newsInfo.star,
        },
        {
          label: '评论数量',
          value: 0,
        },
      ]
    : []

  return (
    <div>
      {newsInfo.id && (
        <div>
          <PageHeader
            onBack={() => navigate(-1)}
            title={newsInfo.title}
            subTitle={<div>{newsInfo.categoryId}</div>}
          >
            <Descriptions size="small" column={3}>
              {descriptions.map((desp: any) => (
                <Descriptions.Item label={desp.label} key={desp.label}>
                  {desp.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{
              margin: '0 24px',
              padding: '10px 20px',
              border: '1px solid gray',
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
