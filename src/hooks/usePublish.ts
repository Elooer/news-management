import { notification } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

function usePublish(type: number) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('news_token') as string)
  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(res => {
        setDataSource(res.data)
      })
  }, [username])
  const handlePublish = (id: number) => {
    setDataSource(dataSource.filter((item: any) => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then(() => {
        notification.info({
          message: `通知`,
          description: `您可以到[发布管理/已发布]中查看您的新闻`,
          placement: 'bottomRight',
        })
      })
  }

  const handleSunset = (id: number) => {
    setDataSource(dataSource.filter((item: any) => item.id !== id))
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then(() => {
        notification.info({
          message: `通知`,
          description: `您可以到[发布管理/已下线]中查看您的新闻`,
          placement: 'bottomRight',
        })
      })
  }

  const handleDelete = (id: number) => {
    setDataSource(dataSource.filter((item: any) => item.id !== id))
    axios.delete(`/news/${id}`).then(() => {
      notification.info({
        message: `通知`,
        description: `您已经删除了已下线的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  return { dataSource, handlePublish, handleSunset, handleDelete }
}

export default usePublish
