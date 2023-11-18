import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILogin } from '../models/ILogin';

export const AuthAPI = createApi({
  reducerPath: 'AuthAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/user`,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILogin, {email: string, password: string}>({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data
      })
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      })
    }),
    registerUser: builder.mutation<ILogin, {username: string, email: string, password: string}>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body
      })
    })
  })
})