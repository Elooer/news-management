import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './router'
import './App.scss'

function App() {
  const outlet = useRoutes(routes)

  return (
    <Suspense fallback={<div>loading...</div>}>
      <>{outlet}</>
    </Suspense>
  )
}

export default App
