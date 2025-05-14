import { AppStore } from "../../store/store";
import { notificationsSlice } from "../../store/reducers/notificationsSlice";

let friendshipWS: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let messageListeners: ((event: MessageEvent) => void)[] = [];
let isConnecting = false;
let msgQueue: string[] = [];

let store: AppStore;

export const injectStoreInFriendship = (_store: AppStore) => {
  store = _store;
};

const connect = () => {
  if (isConnecting) return;

  isConnecting = true;
  try {
    let accessToken = localStorage.getItem("accessToken");
    friendshipWS = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/friendship`,
      accessToken ? accessToken : undefined
    );

    friendshipWS.onopen = () => {
      console.log("Friendship WebSocket connection established");
      isConnecting = false;
      const notificationListener = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.method === "initFriendship") {
          if (!!data.data.friendships) {
            store.dispatch(
              notificationsSlice.actions.setFriendshipNotification(
                data.data.friendships
              )
            );
          }
        }
      };
      friendshipWS?.addEventListener("message", notificationListener);
      // Reattach all message listeners
      messageListeners.forEach((listener) => {
        friendshipWS?.addEventListener("message", listener);
      });
      // Send all messages from queue
      while (msgQueue.length > 0) {
        const msg = msgQueue.shift();
        if (msg) sendFriendshipMessage(msg);
      }
    };

    friendshipWS.addEventListener("message", (msg) => {
      const data = JSON.parse(msg.data);
      if (data.method === "error" && data.data.status === 401) {
        console.log("Friendship WebSocket connection");
      }
    });

    friendshipWS.onclose = () => {
      console.log("Friendship WebSocket connection closed");
      isConnecting = false;
      friendshipWS = null;

      // Clear any existing reconnect timeout
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      // Attempt to reconnect after 1 second
      reconnectTimeout = setTimeout(() => {
        connect();
      }, 1000);
    };

    friendshipWS.onerror = (error) => {
      console.error("Friendship WebSocket error:", error);
      friendshipWS?.close();
    };
  } catch (error) {
    console.error("Failed to create Friendship WebSocket connection:", error);
    isConnecting = false;
    // Attempt to reconnect after 1 second
    reconnectTimeout = setTimeout(() => {
      connect();
    }, 1000);
  }
};

export const startFriendshipWS = () => {
  if (!friendshipWS) {
    connect();
  }
  return friendshipWS!;
};

export const sendFriendshipMessage = (msg: string) => {
  if (friendshipWS && friendshipWS.readyState === friendshipWS.OPEN) {
    friendshipWS.send(msg);
  } else {
    msgQueue.push(msg);
  }
};

export const addFriendshipMessageListener = (
  listener: (event: MessageEvent) => void
) => {
  messageListeners.push(listener);
  if (friendshipWS) {
    friendshipWS.addEventListener("message", listener);
  }
};

export const removeMessageListener = (
  listener: (event: MessageEvent) => void
) => {
  messageListeners = messageListeners.filter((l) => l !== listener);
  if (friendshipWS) {
    friendshipWS.removeEventListener("message", listener);
  }
};
