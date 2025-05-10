import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser } from "../models/IUser";
import { baseQueryWithReauth } from "../utils/baseQuery";
import { IUserTop } from "../dtos/IUserTop";
import { IUserSearchDto } from "../dtos/IUserSearch";
import { IUserStatsDto } from "../dtos/IUserStats";

export const UserAPI = createApi({
  reducerPath: "UserAPI",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: "/user/me",
      }),
    }),

    getTop: builder.query<IUserTop[], void>({
      query: () => ({
        url: "/user/top",
      }),
    }),

    getUsers: builder.query<IUserSearchDto[], { searchQuery: string, onlyFriends?: boolean }>({
      query: ({ searchQuery, onlyFriends = false }) => ({
        url: "/user/users",
        params: {
          searchQuery,
          ...(onlyFriends && {
            onlyFriends
          })
        },
      }),
    }),

    getUserStats: builder.query<IUserStatsDto, number | void>({
      query: (id) => ({
        url: "/user/stats",
        params: {
          userId: id,
        },
      }),
    }),

    getUserById: builder.query<IUser, number>({
      query: (id) => ({
        url: `/user/${id}`,
      }),
    }),
  }),
});
