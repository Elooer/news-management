import axios from 'axios'
import { store } from '../store'
import { changeLoading } from '../store/reducers/loadingReducer'

axios.defaults.baseURL = 'http://localhost:5000'

axios.interceptors.request.use(
  function (config) {
    // 显示loading
    store.dispatch(changeLoading(true))
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    //  隐藏loading
    store.dispatch(changeLoading(false))
    return response
  },
  function (error) {
    //  隐藏loading
    store.dispatch(changeLoading(false))
    return Promise.reject(error)
  }
)
