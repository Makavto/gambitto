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

  constructor(url: string) {
    this.ws = this.createWs(url);
    this.url = url;
    const listener = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.method === 'error' && data.data.status === 401) {
        setTimeout(() => {
          this.ws = this.createWs(url);
        }, 500)
      }
    }
    this.ws.addEventListener('message', listener);
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
      }
      if (data.method === 'initFriendship') {
        store.dispatch(wsSlice.actions.setFriendshipWsReady(true));
        if (!!data.data.friendships) {
          store.dispatch(notificationsSlice.actions.setFriendshipNotification(data.data.friendships))
        }
      }
    }
    ws.addEventListener('message', listener);

  
    return ws;
  }

  revalidateWs = () => {
    this.ws = this.createWs(this.url)
  }
}