import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../utils/baseQuery";
import { IFriendshipDto } from "../dtos/IFriendshipDto";
import { IFriendshipInvitation } from "../dtos/IFriendshipInvitation";
import { FriendshipWsMethodsEnum } from "../models/enums/FriendshipWsMethodsEnum";
import {
  addFriendshipMessageListener,
  sendFriendshipMessage,
  startFriendshipWS,
} from "./ws/FriendshipWs";

startFriendshipWS();

export const FriendshipAPI = createApi({
  reducerPath: "FriendshipAPI",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    friendshipNotificationsListener: builder.query<
      IFriendshipInvitation | null,
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
              !Object.values(FriendshipWsMethodsEnum).find(
                (method) => method === data.method
              )
            ) {
              api.updateCachedData((draft) => {
                return data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    sendInvitation: builder.query<
      { friendship: IFriendshipDto } | null,
      { inviteeId: number }
    >({
      queryFn: async ({ inviteeId }) => {
        sendFriendshipMessage(
          JSON.stringify({ method: FriendshipWsMethodsEnum.Invite, inviteeId })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.Invite) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    declineInvitation: builder.query<
      { friendship: IFriendshipDto } | null,
      { invitationId: number }
    >({
      queryFn: async ({ invitationId }) => {
        sendFriendshipMessage(
          JSON.stringify({
            method: FriendshipWsMethodsEnum.DeclineInvitation,
            invitationId,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.DeclineInvitation) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    acceptInvitation: builder.query<
      { friendship: IFriendshipDto } | null,
      { invitationId: number }
    >({
      queryFn: async ({ invitationId }) => {
        sendFriendshipMessage(
          JSON.stringify({
            method: FriendshipWsMethodsEnum.AcceptInvitation,
            invitationId,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.AcceptInvitation) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    deleteFriendship: builder.query<
      { friendship: IFriendshipDto } | null,
      { invitationId: number }
    >({
      queryFn: async ({ invitationId }) => {
        sendFriendshipMessage(
          JSON.stringify({
            method: FriendshipWsMethodsEnum.Delete,
            invitationId,
          })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.Delete) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getAllFriends: builder.query<
      { friendships: IFriendshipDto[] } | null,
      void
    >({
      queryFn: async () => {
        return new Promise((resolve) => {
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.GetAllFriends) {
              resolve({ data: data.data });
            }
          };
          addFriendshipMessageListener(listener);
          sendFriendshipMessage(
            JSON.stringify({ method: FriendshipWsMethodsEnum.GetAllFriends })
          );
        });
      },
    }),

    getNotifications: builder.query<
      { friendships: IFriendshipDto[] } | null,
      void
    >({
      queryFn: async () => {
        sendFriendshipMessage(
          JSON.stringify({ method: FriendshipWsMethodsEnum.GetAllFriends })
        );
        return { data: null };
      },
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === FriendshipWsMethodsEnum.GetAllFriends) {
              api.updateCachedData((draft) => {
                return data.data;
              });
            }
          };
          addFriendshipMessageListener(listener);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});
