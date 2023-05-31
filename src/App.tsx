import { Suspense, useState, useEffect } from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
import routes from './router'
import axios from 'axios'
import './App.scss'
import Home from './views/sandbox/home'
import UserList from './views/sandbox/userManage/UserList'
import RoleList from './views/sandbox/rightManage/RoleList'
import RightList from './views/sandbox/rightManage/RightList'
import NewsAdd from './views/sandbox/newsManage/NewsAdd'
import NewsDraft from './views/sandbox/newsManage/NewsDraft'
import NewsCategory from './views/sandbox/newsManage/NewsCategory'
import Audit from './views/sandbox/auditManage/Audit'
import AuditList from './views/sandbox/auditManage/AuditList'
import Unpublished from './views/sandbox/publishManage/Unpublished'
import Published from './views/sandbox/publishManage/Published'
import Sunset from './views/sandbox/publishManage/Sunset'
import Sandbox from './views/sandbox'
import Login from './views/login'
import NoPermission from './views/sandbox/nopermission'

function App() {
  const [backRouteList, setBackRouteList] = useState<any>([])

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/rights'),
      axios.get('http://localhost:5000/children'),
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const rotesMap: any = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />,
  }

  const Redirect = ({ children }: any) => {
    const token = localStorage.getItem('news_token')
    return token ? children : <Navigate to="/login" />
  }

  const checkRoute = (item: any): boolean => {
    return rotesMap[item.key] && item.pagepermisson
  }

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('news_token') || '') || {}

  const checkUserPermission = (item: any): boolean => {
    return rights.includes(item.key)
  }

  const newRoutes = backRouteList.map((item: any) => {
    if (checkRoute(item) && checkUserPermission(item)) {
      return {
        path: item.key,
        element: rotesMap[item.key],
      }
    }
    return {
      path: item.key,
      element: <NoPermission />,
    }
  })

  const res = [
    {
      path: '/',
      element: (
        <Redirect>
          <Sandbox />
        </Redirect>
      ),
      children: [
        ...newRoutes,
        {
          path: '*',
          element: <NoPermission />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
  ]
  newRoutes.unshift()
  console.log(newRoutes)

  const outlet = useRoutes(res)

  return (
    <Suspense fallback={<div>loading...</div>}>
      <>{outlet}</>
    </Suspense>
  )
}

export default App
