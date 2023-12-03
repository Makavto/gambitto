import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../utils/baseQuery";
import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "../dtos/IGameDto";
import { IGameFullInfoDto } from "../dtos/IGameFullInfoDto";
import { IChessWsDto } from "../dtos/IChessWsDto";
import { IChessWsFullInfoDto } from "../dtos/IChessWsFullInfoDto";
import { Ws } from "./ws/Ws";

const chessWs = new Ws(`${process.env.REACT_APP_WS_URL}/chess`);

export const ChessAPI = createApi({
  reducerPath: 'ChessAPI',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    createWs: builder.query<null, void>({
      queryFn: async () => {
        return {data: null}
      },
      async onCacheEntryAdded(
        arg,
        api,
      ) {
        try {
          await api.cacheDataLoaded
          chessWs.revalidateWs();
        } catch (error) {
          console.log(error)
        }
      }
    }),

    chessNotificationsListener: builder.query<IChessWsDto | IChessWsFullInfoDto | null, void>({
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
                return data
              });
            }
          }
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    getAllGames: builder.query<{games: IGameDto[]} | null, void>({
      queryFn: async (arg) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.GetAllGames}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      },
    }),

    getChessNotifications: builder.query<{games: IGameDto[]} | null, void>({
      queryFn: async (arg) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.GetNotifications}))
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
            if (data.method === ChessWsMethodsEnum.GetNotifications) {
              api.updateCachedData((draft) => {
                return data.data
              })
            }
          }
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      },
    }),

    sendInvitation: builder.query<{game: IGameDto} | null, {inviteeId: number}>({
      queryFn: async ({inviteeId}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.Invite, inviteeId}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    acceptInvitation: builder.query<{game: IGameDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.AcceptInvitation, gameId}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    declineInvitation: builder.query<{game: IGameDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.DeclineInvitation, gameId}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    makeMove: builder.query<{gameFullInfo: IGameFullInfoDto} | null, {gameId: number, moveCode: string}>({
      queryFn: async ({gameId, moveCode}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.MakeMove, gameId, moveCode}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    getGameInfo: builder.query<{gameFullInfo: IGameFullInfoDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.GetGameInfo, gameId}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),

    resign: builder.query<{game: IGameDto} | null, {gameId: number}>({
      queryFn: async ({gameId}) => {
        chessWs.ws.send(JSON.stringify({method: ChessWsMethodsEnum.Resign, gameId}))
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
          chessWs.ws.addEventListener('message', listener)
        } catch (error) {
          console.log(error)
        }
      }
    }),
  })
})
