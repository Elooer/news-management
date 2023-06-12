import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LoadingState {
  value: boolean
}

// 使用该类型定义初始 state
const initialState: LoadingState = {
  value: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    changeLoading: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

export const { changeLoading } = loadingSlice.actions

export default loadingSlice.reducer
