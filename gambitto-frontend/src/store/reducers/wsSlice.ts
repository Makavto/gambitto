import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface WsState {
  chessWsReady: boolean,
  friendshipWsReady: boolean,
}

const initialState: WsState = {
  chessWsReady: false,
  friendshipWsReady: false
}

export const wsSlice = createSlice({
  name: 'wsSlice',
  initialState,
  reducers: {
    setChessWsReady(state, action: PayloadAction<boolean>) {
      state.chessWsReady = action.payload
    },
    setFriendshipWsReady(state, action: PayloadAction<boolean>) {
      state.friendshipWsReady = action.payload
    },
  }
})

export default wsSlice.reducer