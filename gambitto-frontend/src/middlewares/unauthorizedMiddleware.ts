import { Middleware, MiddlewareAPI, isRejectedWithValue } from "@reduxjs/toolkit";

export const unauthorizedMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.log(action)
  }
  return next(action)
}