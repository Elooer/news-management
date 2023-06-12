import { createSlice } from '@reduxjs/toolkit'

interface CollapsedState {
  value: boolean
}

// 使用该类型定义初始 state
const initialState: CollapsedState = {
  value: false,
}

export const collapsedSlice = createSlice({
  name: 'collapsed',
  initialState,
  reducers: {
    changeCollapsed: state => {
      state.value = !state.value
    },
  },
})

export const { changeCollapsed } = collapsedSlice.actions

export default collapsedSlice.reducer
