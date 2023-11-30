import { createApi } from '@reduxjs/toolkit/query/react';
import { IUser } from '../models/IUser';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { IUserTop } from '../dtos/IUserTop';
import { IUserSearchDto } from '../dtos/IUserSearch';

export const UserAPI = createApi({
  reducerPath: 'UserAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: '/user/me',
      })
    }),

    getTop: builder.query<IUserTop[], void>({
      query: () => ({
        url: '/user/top',
      })
    }),

    getUsers: builder.query<IUserSearchDto[], {searchQuery: string}>({
      query: ({searchQuery}) => ({
        url: '/user/users',
        params: {
          searchQuery
        }
      })
    })
  })
})