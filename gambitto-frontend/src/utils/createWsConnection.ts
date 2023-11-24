export const createWsConnection = (url: string) => {
  const createWs = () => {
    let accessToken = localStorage.getItem('accessToken');
    const chessWs = new WebSocket(url, accessToken ? accessToken : undefined);
  
    return chessWs;
  }
  
  let ws = createWs();
  
  const listener = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.method === 'error' && data.data.status === 401) {
      setTimeout(() => {
        ws = createWs();
      }, 500)
    }
  }
  ws.addEventListener('message', listener);
  return ws
}