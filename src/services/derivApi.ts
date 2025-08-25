// src/services/derivApi.ts
const APP_ID = 1089; // FIX: Use a valid, public app_id for testing.
const ENDPOINT = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;

class DerivAPI {
  private ws: WebSocket | null = null;
  private listeners: Record<string, (data: any) => void> = {};

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    
    // If it's already connecting, create a promise that resolves on open/rejects on error
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      return new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError);
          resolve();
        };
        const onError = (err: Event) => {
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError);
          reject(err);
        };
        this.ws.addEventListener('open', onOpen);
        this.ws.addEventListener('error', onError);
      });
    }

    this.ws = new WebSocket(ENDPOINT);

    return new Promise<void>((resolve, reject) => {
      this.ws!.onopen = () => resolve();
      this.ws!.onerror = (err) => reject(err);
      this.ws!.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.msg_type && this.listeners[data.msg_type]) {
          this.listeners[data.msg_type](data);
        }
      };
      // Allow for reconnection by nullifying on close
      this.ws!.onclose = () => {
        this.ws = null;
      };
    });
  }

  close() {
    if (this.ws) {
      // Prevent onclose from firing during a manual close
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  async authorize(token: string) {
    this.send({ authorize: token });
  }

  // --- Tick Subscription ---
  subscribeTicks(symbol: string, cb: (quote: number) => void) {
    if (!symbol) return;
    this.send({ ticks: symbol, subscribe: 1 });

    this.listeners["tick"] = (data) => {
      if (data?.tick?.symbol === symbol) {
        cb(data.tick.quote);
      }
    };
  }

  forgetAllTicks() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.send({ forget_all: "ticks" });
  }

  // --- Core send wrapper ---
  private send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }
}

export const derivApi = new DerivAPI();
