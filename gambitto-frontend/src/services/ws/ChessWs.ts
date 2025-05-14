import { AppStore } from "../../store/store";
import { notificationsSlice } from "../../store/reducers/notificationsSlice";

let chessWS: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let messageListeners: ((event: MessageEvent) => void)[] = [];
let isConnecting = false;
let msgQueue: string[] = [];

let store: AppStore;

export const injectStoreInChess = (_store: AppStore) => {
  store = _store;
};

const connect = () => {
  if (isConnecting) return;

  isConnecting = true;
  try {
    let accessToken = localStorage.getItem("accessToken");
    chessWS = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/chess`,
      accessToken ? accessToken : undefined
    );

    chessWS.onopen = () => {
      console.log("Chess WebSocket connection established");
      isConnecting = false;
      const notificationListener = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.method === "initChess") {
          if (data.data.games.length > 0) {
            store.dispatch(
              notificationsSlice.actions.setChessNotification(data.data.games)
            );
          }
        }
      };
      chessWS?.addEventListener("message", notificationListener);
      // Reattach all message listeners
      messageListeners.forEach((listener) => {
        chessWS?.addEventListener("message", listener);
      });
      // Send all messages from queue
      while (msgQueue.length > 0) {
        const msg = msgQueue.shift();
        if (msg) sendChessMessage(msg);
      }
    };

    chessWS.addEventListener("message", (msg) => {
      const data = JSON.parse(msg.data);
      if (data.method === "error" && data.data.status === 401) {
        console.log("Chess WebSocket connection");
      }
    });

    chessWS.onclose = () => {
      console.log("Chess WebSocket connection closed");
      isConnecting = false;
      chessWS = null;

      // Clear any existing reconnect timeout
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      // Attempt to reconnect after 1 second
      reconnectTimeout = setTimeout(() => {
        connect();
      }, 1000);
    };

    chessWS.onerror = (error) => {
      console.error("Chess WebSocket error:", error);
      chessWS?.close();
    };
  } catch (error) {
    console.error("Failed to create Chess WebSocket connection:", error);
    isConnecting = false;
    // Attempt to reconnect after 1 second
    reconnectTimeout = setTimeout(() => {
      connect();
    }, 1000);
  }
};

export const startChessWS = () => {
  if (!chessWS) {
    connect();
  }
  return chessWS!;
};

export const sendChessMessage = (msg: string) => {
  if (chessWS && chessWS.readyState === chessWS.OPEN) {
    chessWS.send(msg);
  } else {
    msgQueue.push(msg);
  }
};

export const addChessMessageListener = (
  listener: (event: MessageEvent) => void
) => {
  messageListeners.push(listener);
  if (chessWS) {
    chessWS.addEventListener("message", listener);
  }
};

export const removeMessageListener = (
  listener: (event: MessageEvent) => void
) => {
  messageListeners = messageListeners.filter((l) => l !== listener);
  if (chessWS) {
    chessWS.removeEventListener("message", listener);
  }
};
