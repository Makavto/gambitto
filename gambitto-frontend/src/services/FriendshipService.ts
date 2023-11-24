import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "../utils/baseQuery"
import { createWsConnection } from "../utils/createWsConnection";

const friendshipWs = createWsConnection('ws://localhost:5000/api/friendship');

export const FriendshipAPI = createApi({
  reducerPath: 'FriendshipAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    friendshipWebsocket: builder.query<any, {method: string} | void>({
      queryFn: async (arg) => {
        if (arg?.method) {
          friendshipWs.send(JSON.stringify({method: arg.method}))
        }
        return {method: '', data: {}}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            api.updateCachedData((draft) => {
              return data
            })
          }
          friendshipWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
        await api.cacheEntryRemoved
        friendshipWs.close()
      }
    }),

  })
})