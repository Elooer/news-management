import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Login = lazy(() => import('../views/login'))
const Sandbox = lazy(() => import('../views/sandbox'))
const Home = lazy(() => import('../views/sandbox/home'))
const UserList = lazy(() => import('../views/sandbox/userManage/UserList'))
const RoleList = lazy(() => import('../views/sandbox/rightManage/RoleList'))
const RightList = lazy(() => import('../views/sandbox/rightManage/RightList'))
const NoPermission = lazy(() => import('../views/sandbox/nopermission'))

// const lazyLoad = function (component: string) {
//   const LazyComponent = lazy(() => import.(`../views/${component}`))
//   return <LazyComponent />
// }

const Redirect = ({ children }: any) => {
  const token = localStorage.getItem('news_token')
  return token ? children : <Navigate to="/login" />
}

interface RouteType {
  name?: string
  path: string
  children?: Array<RouteType>
  element: any
}

const routes: Array<RouteType> = [
  {
    path: '/',
    element: (
      <Redirect>
        <Sandbox />
      </Redirect>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="home" />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'user-manage/list',
        element: <UserList />,
      },
      {
        path: 'right-manage/role/list',
        element: <RoleList />,
      },
      {
        path: 'right-manage/right/list',
        element: <RightList />,
      },
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

export default routes
