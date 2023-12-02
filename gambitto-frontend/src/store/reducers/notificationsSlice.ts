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
    deleteChessNotification(state, action: PayloadAction<IGameDto>) {
      state.chessNotifications = state.chessNotifications.filter(chess => chess.id !== action.payload.id);
    },
    setFriendshipNotification(state, action: PayloadAction<IFriendshipDto[]>) {
      state.friendshipNotifications = action.payload;
    },
    addFriendshipNotification(state, action: PayloadAction<IFriendshipDto>) {
      state.friendshipNotifications.push(action.payload);
    },
    deleteFriendshipNotification(state, action: PayloadAction<IFriendshipDto>) {
      state.friendshipNotifications = state.friendshipNotifications.filter(friendship => friendship.id !== action.payload.id);
    }
  }
})

export default notificationsSlice.reducer;