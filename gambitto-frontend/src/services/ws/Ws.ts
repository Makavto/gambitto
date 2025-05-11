import { notificationsSlice } from "../../store/reducers/notificationsSlice";
import {wsSlice} from "../../store/reducers/wsSlice";
import { AppStore } from "../../store/store";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
}

export class Ws {
  ws!: WebSocket;
  private url!: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = Infinity;
  private reconnectInterval: number = 1000; // 1 second
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
    this.ws = this.createWs(url);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const messageListener = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.method === 'error' && data.data.status === 401) {
        this.handleReconnect();
      }
    };

    const closeListener = () => {
      this.handleReconnect();
    };

    const errorListener = () => {
      this.handleReconnect();
    };

    this.ws.addEventListener('message', messageListener);
    this.ws.addEventListener('close', closeListener);
    this.ws.addEventListener('error', errorListener);
  }

  private handleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        this.ws = this.createWs(this.url);
        this.setupEventListeners();
      }
    }, this.reconnectInterval);
  }

  private createWs = (url: string) => {
    let accessToken = localStorage.getItem('accessToken');
    const ws = new WebSocket(url, accessToken ? accessToken : undefined);

    const listener = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.method === 'initChess') {
        store.dispatch(wsSlice.actions.setChessWsReady(true));
        if (data.data.games.length > 0) {
          store.dispatch(notificationsSlice.actions.setChessNotification(data.data.games))
        }
        // Reset reconnect attempts on successful connection
        this.reconnectAttempts = 0;
      }
      if (data.method === 'initFriendship') {
        store.dispatch(wsSlice.actions.setFriendshipWsReady(true));
        if (!!data.data.friendships) {
          store.dispatch(notificationsSlice.actions.setFriendshipNotification(data.data.friendships))
        }
        // Reset reconnect attempts on successful connection
        this.reconnectAttempts = 0;
      }
    }
    ws.addEventListener('message', listener);
  
    return ws;
  }

  revalidateWs = () => {
    this.ws = this.createWs(this.url);
    this.setupEventListeners();
  }
}