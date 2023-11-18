import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { unauthorizedMiddleware } from "../middlewares/unauthorizedMiddleware";

const rootReducer = combineReducers({

});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(unauthorizedMiddleware)
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']