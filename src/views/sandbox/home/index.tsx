import { useEffect, useState, useRef } from 'react'
import { Row, Col, Card, List, Avatar, Drawer } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import * as ECharts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])
  const barRef = useRef<HTMLElement>()
  const pieRef = useRef<HTMLElement>()

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`
      )
      .then(res => {
        setViewList(res.data)
      })
  }, [])

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`
      )
      .then(res => {
        setStarList(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
    return () => {
      //组件销毁时，删除onresize事件
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj: any) => {
    console.log(obj)
    // 基于准备好的dom，初始化echarts实例
    var myChart = ECharts.init(barRef.current!)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          interval: 0,
          rotate: '45',
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item: any) => item.length),
        },
      ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = () => {
    let currentList = allList.filter((data: any) => data.author === username)
    let groupObj = _.groupBy(currentList, (item: any) => item.category.title)
    let list = []
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      })
    }

    var myChart
    if (!pieChart) {
      myChart = ECharts.init(pieRef.current!)
      setPieChart(myChart as any)
    } else {
      myChart = pieChart
    }

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    option && myChart.setOption(option)
  }

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('news_token') as string) || {
    username: '',
    region: '全球',
    role: { roleName: '' },
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={viewList}
              renderItem={(item: any) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={starList}
              renderItem={(item: any) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setVisible(true)
                  setTimeout(() => {
                    // init初始化
                    renderPieView()
                  }, 0)
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  {roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
      >
        <div
          ref={pieRef as any}
          style={{ height: '400px', width: '100%', marginTop: '30px' }}
        ></div>
      </Drawer>
      <div
        ref={barRef as any}
        style={{ height: '400px', width: '100%', marginTop: '30px' }}
      ></div>
    </div>
  )
}
