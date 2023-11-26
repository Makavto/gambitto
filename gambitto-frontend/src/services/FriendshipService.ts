import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "../utils/baseQuery"
import { createWsConnection } from "../utils/createWsConnection";

let friendshipWs = createWsConnection('ws://localhost:5000/api/friendship');

export const FriendshipAPI = createApi({
  reducerPath: 'FriendshipAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createWs: builder.query<any, void>({
      queryFn: async () => {
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          friendshipWs = createWsConnection('ws://localhost:5000/api/friendship');
        } catch (error) {
          console.log(error)
        }
      }
    }),

  })
})