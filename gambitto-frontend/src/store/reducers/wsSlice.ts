import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface WsState {
  wsReady: boolean,
}

const initialState: WsState = {
  wsReady: false,
}

export const wsSlice = createSlice({
  name: 'wsSlice',
  initialState,
  reducers: {
    setWsReady(state, action: PayloadAction<boolean>) {
      state.wsReady = action.payload
    },
  }
})

export default wsSlice.reducer