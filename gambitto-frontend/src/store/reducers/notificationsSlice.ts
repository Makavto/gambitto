import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFriendshipDto } from "../../dtos/IFriendshipDto";
import { IGameDto } from "../../dtos/IGameDto";

interface NotificationsStore {
  chessNotifications: IGameDto[];
  friendshipNotifications: IFriendshipDto[];
}

const initialState: NotificationsStore = {
  chessNotifications: [],
  friendshipNotifications: []
}

export const notificationsSlice = createSlice({
  initialState,
  name: 'notificationsSlice',
  reducers: {
    setChessNotification(state, action: PayloadAction<IGameDto[]>) {
      state.chessNotifications = action.payload;
    },
    addChessNotification(state, action: PayloadAction<IGameDto>) {
      state.chessNotifications.push(action.payload);
    },
    setFriendshipNotification(state, action: PayloadAction<IFriendshipDto[]>) {
      state.friendshipNotifications = action.payload;
    },
    addFriendshipNotification(state, action: PayloadAction<IFriendshipDto>) {
      state.friendshipNotifications.push(action.payload);
    },
  }
})

export default notificationsSlice.reducer;