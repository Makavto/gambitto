import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../utils/baseQuery";
import {
  ChessWsMethodsEnum,
  ChessWsServerMethodsEnum,
} from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "../dtos/IGameDto";
import { IGameFullInfoDto } from "../dtos/IGameFullInfoDto";
import { IChessWsDto } from "../dtos/IChessWsDto";
import { IChessWsFullInfoDto } from "../dtos/IChessWsFullInfoDto";
import {
  addChessMessageListener,
  sendChessMessage,
  startChessWS,
} from "./ws/ChessWs";

startChessWS();

export const ChessAPI = createApi({
  reducerPath: "ChessAPI",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    chessNotificationsListener: builder.query<
      IChessWsDto | IChessWsFullInfoDto | null,
      void
    >({
      queryFn: async () => {
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (
              !Object.values(ChessWsMethodsEnum).find(
                (method) => method === data.method
              )
            ) {
              api.updateCachedData((draft) => {
                return data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getAllGames: builder.query<{ games: IGameDto[] } | null, void | number>({
      queryFn: async (userId) => {
        return new Promise((resolve) => {
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.GetAllGames) {
              resolve({ data: data.data });
            }
          };
          addChessMessageListener(listener);
          sendChessMessage(
            JSON.stringify({ method: ChessWsMethodsEnum.GetAllGames, userId })
          );
        });
      },
    }),

    getChessNotifications: builder.query<{ games: IGameDto[] } | null, void>({
      queryFn: async (arg) => {
        sendChessMessage(
          JSON.stringify({ method: ChessWsMethodsEnum.GetNotifications })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.GetNotifications) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    sendInvitation: builder.query<
      { game: IGameDto } | null,
      { inviteeId: number }
    >({
      queryFn: async ({ inviteeId }) => {
        sendChessMessage(
          JSON.stringify({ method: ChessWsMethodsEnum.Invite, inviteeId })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.Invite) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    startRatingGameSearch: builder.query<
      { game: IGameDto | null } | null,
      void
    >({
      queryFn: async () => {
        sendChessMessage(
          JSON.stringify({ method: ChessWsMethodsEnum.StartSearch })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsServerMethodsEnum.Accepted) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    endRatingGameSearch: builder.query<null, void>({
      queryFn: async () => {
        sendChessMessage(
          JSON.stringify({ method: ChessWsMethodsEnum.EndSearch })
        );
        return { data: null };
      },
    }),

    acceptInvitation: builder.query<
      { game: IGameDto } | null,
      { gameId: number }
    >({
      queryFn: async ({ gameId }) => {
        sendChessMessage(
          JSON.stringify({
            method: ChessWsMethodsEnum.AcceptInvitation,
            gameId,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.AcceptInvitation) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    declineInvitation: builder.query<
      { game: IGameDto } | null,
      { gameId: number }
    >({
      queryFn: async ({ gameId }) => {
        sendChessMessage(
          JSON.stringify({
            method: ChessWsMethodsEnum.DeclineInvitation,
            gameId,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.DeclineInvitation) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    makeMove: builder.query<
      { gameFullInfo: IGameFullInfoDto } | null,
      { gameId: number; moveCode: string }
    >({
      queryFn: async ({ gameId, moveCode }) => {
        sendChessMessage(
          JSON.stringify({
            method: ChessWsMethodsEnum.MakeMove,
            gameId,
            moveCode,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.MakeMove) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getGameInfo: builder.query<
      { gameFullInfo: IGameFullInfoDto } | null,
      { gameId: number }
    >({
      queryFn: async ({ gameId }) => {
        return new Promise((resolve) => {
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.GetGameInfo) {
              resolve({data: data.data})
            }
          };
          addChessMessageListener(listener);
          sendChessMessage(
            JSON.stringify({ method: ChessWsMethodsEnum.GetGameInfo, gameId })
          );
        })
      },
    }),

    resign: builder.query<
      { gameFullInfo: IGameFullInfoDto } | null,
      { gameId: number }
    >({
      queryFn: async ({ gameId }) => {
        sendChessMessage(
          JSON.stringify({ method: ChessWsMethodsEnum.Resign, gameId })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === ChessWsMethodsEnum.Resign) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addChessMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});
