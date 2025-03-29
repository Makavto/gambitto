export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private maxRetries = 5;
  private retryCount = 0;
  private reconnectDelay = 500;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    this.socket = new WebSocket(this.url, accessToken);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.retryCount = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error === 401) {
          this.reconnect();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    this.socket.onclose = () => {
      console.warn("WebSocket closed");
      this.reconnect();
    };
  }

  private reconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error("Max reconnect attempts reached");
    }
  }

  public sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Message not sent.");
    }
  }

  public getSocket() {
    if (!this.socket) {
      this.connect();
    }
    return this.socket;
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
