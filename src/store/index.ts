import { configureStore } from '@reduxjs/toolkit'
import collapsedReducer from './reducers/collapsedReducer'
import loadingReducer from './reducers/loadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, collapsedReducer)

const store = configureStore({
  reducer: {
    collapsed: persistedReducer,
    loading: loadingReducer,
  },
})
const persistor = persistStore(store)
export { store, persistor }
export type RootState = ReturnType<typeof store.getState>
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
