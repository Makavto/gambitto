import { createApi } from '@reduxjs/toolkit/query/react';
import { IUser } from '../models/IUser';
import { baseQueryWithReauth } from '../utils/baseQuery';

export const UserAPI = createApi({
  reducerPath: 'UserAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: '/user/me',
      })
    })
  })
})