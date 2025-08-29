export interface Market {
  id: string; // This is the Deriv symbol, e.g., 'R_100'
  name: string;
  group: 'Synthetics' | 'Forex' | 'Crypto' | 'Commodities' | 'Indices';
  tooltip?: string;
}

export interface Settings {
  marketId: string; // This will store the Deriv symbol (market.id)
  strategy: 'NeuroBot' | 'TrendBot' | 'MeanReversionBot';
  mode: 'Faster' | 'Balanced' | 'Safer';
  amount: number;
  targetProfit: number;
  stopLoss: number;
  riskManagement: 'Conservative' | 'Moderate' | 'Aggressive';
}

export interface Tick {
  time: number;
  price: number;
}

export type TradeType = 'CALL' | 'PUT' | 'RESET_CALL' | 'RESET_PUT';

export interface Trade {
  id: string;
  side: TradeType;
  amount: number;
  multiplier: number;
  duration: { value: number; unit: 'Ticks' | 'Seconds' | 'Minutes' };
  entryTime: number;
  exitTime?: number;
  resetTime?: number; // For RESET trades
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
