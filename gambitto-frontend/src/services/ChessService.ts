import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../utils/baseQuery";
import { createWsConnection } from "../utils/createWsConnection";
import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "../dtos/IGameDto";

const chessWs = createWsConnection('ws://localhost:5000/api/chess');

export const ChessAPI = createApi({
  reducerPath: 'ChessAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    chessNotifications: builder.query<any, void>({
      queryFn: async () => {
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (!Object.values(ChessWsMethodsEnum).find((method) => method === data.method)) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    getAllGames: builder.query<any, void>({
      queryFn: async (arg) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.GetAllGames}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.GetAllGames) {
              api.updateCachedData((draft) => {
                return data.data
              })
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      },
    }),

    sendInvitation: builder.query<{game: IGameDto} | null, {inviteeId: number}>({
      queryFn: async ({inviteeId}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.Invite, inviteeId}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.Invite) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    acceptInvitation: builder.query<{game: IGameDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.AcceptInvitation, gameId}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.AcceptInvitation) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    declineInvitation: builder.query<{game: IGameDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.DeclineInvitation, gameId}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.DeclineInvitation) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    makeMove: builder.query<any, {gameId: number, moveCode: string}>({
      queryFn: async ({gameId, moveCode}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.MakeMove, gameId, moveCode}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.MakeMove) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    getGameInfo: builder.query<any, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.GetGameInfo, gameId}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.GetGameInfo) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    resign: builder.query<any, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.send(JSON.stringify({method: ChessWsMethodsEnum.Resign, gameId}))
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.Resign) {
              api.updateCachedData((draft) => {
                return data.data
              });
            }
          }
          chessWs.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),
  })
})
