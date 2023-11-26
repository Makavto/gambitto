import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AuthAPI } from "../services/AuthService";
import userSlice from './reducers/userSlice';
import { UserAPI } from "../services/UserService";
import { ChessAPI } from "../services/ChessService";
import { FriendshipAPI } from "../services/FriendshipService";

const rootReducer = combineReducers({
  userSlice,
  [AuthAPI.reducerPath]: AuthAPI.reducer,
  [UserAPI.reducerPath]: UserAPI.reducer,
  [ChessAPI.reducerPath]: ChessAPI.reducer,
  [FriendshipAPI.reducerPath]: FriendshipAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(AuthAPI.middleware, UserAPI.middleware, ChessAPI.middleware, FriendshipAPI.middleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']