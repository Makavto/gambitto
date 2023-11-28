import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../utils/baseQuery";
import { createWsConnection } from "../utils/createWsConnection";
import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "../dtos/IGameDto";
import { IMoveDto } from "../dtos/IMoveDto";
import { IAcceptedChessInvitationDto } from "../dtos/IAcceptChessInvitation";
import { IDeclineChessInvitationDto } from "../dtos/IDeclineChessInvitation";
import { IMakeChessMoveDto } from "../dtos/IMakeChessMove";
import { IResignChessGameDto } from "../dtos/IResignChessGame";
import { ISendChessInvitationDto } from "../dtos/ISendChessInvitation";
import { IGameFullInfoDto } from "../dtos/IGameFullInfoDto";

let chessWs = createWsConnection('ws://localhost:5000/api/chess');

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
          chessWs = createWsConnection('ws://localhost:5000/api/chess');
        } catch (error) {
          console.log(error)
        }
      }
    }),

    chessNotifications: builder.query<IAcceptedChessInvitationDto | IDeclineChessInvitationDto | IMakeChessMoveDto | IResignChessGameDto | ISendChessInvitationDto | null, void>({
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

    getAllGames: builder.query<{games: IGameDto[]} | null, void>({
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

    makeMove: builder.query<{gameFullInfo: IGameFullInfoDto} | null, {gameId: number, moveCode: string}>({
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

    getGameInfo: builder.query<{gameFullInfo: IGameFullInfoDto} | null, {gameId: number}>({
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

    resign: builder.query<{game: IGameDto} | null, {gameId: number}>({
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
