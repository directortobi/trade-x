// src/services/derivApi.ts
const APP_ID = import.meta.env.VITE_DERIV_APP_ID || '1089';
const ENDPOINT = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;

class DerivAPI {
  private ws: WebSocket | null = null;
  private listeners: Record<string, (data: any) => void> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  connect(): Promise<void> {
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

    console.log(`Connecting to Deriv API: ${ENDPOINT}`);
    this.ws = new WebSocket(ENDPOINT);

    return new Promise<void>((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('Failed to create WebSocket'));
        return;
      }

      this.ws.onopen = () => {
        console.log('Deriv API WebSocket connection opened');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onerror = (err) => {
        console.error('Deriv API WebSocket error:', err);
        reject(new Error('WebSocket connection failed'));
      };

      this.ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.error) {
            console.error('Deriv API error:', data.error);
            return;
          }
          if (data.msg_type && this.listeners[data.msg_type]) {
            this.listeners[data.msg_type](data);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('Deriv API WebSocket connection closed:', event.code, event.reason);
        this.ws = null;
        
        // Auto-reconnect if not manually closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          setTimeout(() => {
            this.connect().catch(err => 
              console.error('Reconnection failed:', err)
            );
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    });
  }

  close() {
    if (this.ws) {
      this.ws.close(1000, 'Manual close');
      this.ws = null;
    }
    this.listeners = {};
  }

  async authorize(token: string) {
    if (!token || token === 'YOUR_API_KEY') {
      console.warn('No valid API token provided for authorization');
      return;
    }
    this.send({ authorize: token });
  }

  // --- Tick Subscription ---
  subscribeTicks(symbol: string, cb: (quote: number) => void) {
    if (!symbol) {
      console.error('No symbol provided for tick subscription');
      return;
    }
    
    console.log(`Subscribing to ticks for symbol: ${symbol}`);
    this.send({ ticks: symbol, subscribe: 1 });

    this.listeners["tick"] = (data) => {
      if (data?.tick?.symbol === symbol && typeof data.tick.quote === 'number') {
        cb(data.tick.quote);
      }
    };
  }

  forgetAllTicks() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('Cannot forget ticks: WebSocket not connected');
      return;
    }
    console.log('Forgetting all tick subscriptions');
    this.send({ forget_all: "ticks" });
  }

  // --- Core send wrapper ---
  private send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.error('Cannot send message: WebSocket not connected', msg);
    }
  }

  // Getter for connection status
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Getter for connection state
  get connectionState(): string {
    if (!this.ws) return 'DISCONNECTED';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
}

export const derivApi = new DerivAPI();
