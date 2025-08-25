export interface Market {
  id: string;
  name: string;
  tooltip?: string;
}

export interface Settings {
  marketId: string;
  strategy: 'NeuroBot';
  mode: 'Faster' | 'Balanced' | 'Safer';
  amount: number;
  targetProfit: number;
  stopLoss: number;
}

export interface Tick {
  time: number;
  price: number;
}

export interface Trade {
  id: string;
  side: 'Rise' | 'Fall';
  amount: number;
  multiplier: number;
  duration: { value: number; unit: 'Ticks' | 'Seconds' | 'Minutes' };
  entryTime: number;
  exitTime?: number;
  entryPrice: number;
  exitPrice?: number;
  payoutPct: number;
  pnl?: number;
  status: 'pending' | 'open' | 'won' | 'lost' | 'cancelled';
}

export interface LogItem {
  time: number;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface TradingState {
  balance: number;
  balancePercent: number;
  isRobotRunning: boolean;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  ticks: Tick[];
  trades: Trade[];
  logs: LogItem[];
  settings: Settings;
}
