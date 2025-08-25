import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TradingState, Trade, LogItem, Tick } from '../types';

interface TradingStore extends TradingState {
  updateSettings: (settings: Partial<TradingState['settings']>) => void;
  startRobot: () => void;
  stopRobot: () => void;
  addTick: (tick: Tick) => void;
  addTrade: (trade: Trade) => void;
  addLog: (log: LogItem) => void;
  updateBalance: (amount: number) => void;
  executeTrade: (side: 'Rise' | 'Fall', amount: number, multiplier: number, duration: { value: number; unit: 'Ticks' }) => void;
  resolveTrade: (tradeId: string) => void;
}

const initialState: TradingState = {
  balance: 300,
  balancePercent: 0,
  isRobotRunning: false,
  currentPrice: 1241.7500,
  priceChange: -0.0600,
  priceChangePercent: -0.00,
  ticks: [],
  trades: [],
  logs: [],
  settings: {
    marketId: 'volatility-100',
    strategy: 'NeuroBot',
    mode: 'Faster',
    amount: 1,
    targetProfit: 20,
    stopLoss: 1000
  }
};

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      startRobot: () => {
        set({ isRobotRunning: true });
        get().addLog({
          time: Date.now(),
          level: 'info',
          message: `Robot started with ${get().settings.strategy} strategy`
        });
      },
      
      stopRobot: () => {
        set({ isRobotRunning: false });
        get().addLog({
          time: Date.now(),
          level: 'info',
          message: 'Robot stopped'
        });
      },
      
      addTick: (tick) =>
        set((state) => {
          const newTicks = [...state.ticks, tick].slice(-500); // Keep last 500 ticks
          const previousPrice = state.currentPrice;
          const priceChange = tick.price - previousPrice;
          const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
          
          return {
            ticks: newTicks,
            currentPrice: tick.price,
            priceChange,
            priceChangePercent
          };
        }),
      
      addTrade: (trade) =>
        set((state) => ({
          trades: [trade, ...state.trades]
        })),
      
      addLog: (log) =>
        set((state) => ({
          logs: [log, ...state.logs].slice(0, 100) // Keep last 100 logs
        })),
      
      updateBalance: (amount) =>
        set((state) => {
          const newBalance = state.balance + amount;
          const balancePercent = ((newBalance - initialState.balance) / initialState.balance) * 100;
          return {
            balance: newBalance,
            balancePercent
          };
        }),
      
      executeTrade: (side, amount, multiplier, duration) => {
        const state = get();
        const trade: Trade = {
          id: `trade_${Date.now()}`,
          side,
          amount,
          multiplier,
          duration,
          entryTime: Date.now(),
          entryPrice: state.currentPrice,
          payoutPct: 0.88,
          status: 'open'
        };
        
        get().addTrade(trade);
        get().addLog({
          time: Date.now(),
          level: 'info',
          message: `${side} trade opened: $${amount} at ${state.currentPrice.toFixed(4)}`
        });
      },

      resolveTrade: (tradeId: string) => {
        const state = get();
        const trade = state.trades.find(t => t.id === tradeId);

        if (!trade || trade.status !== 'open') return;

        const finalPrice = state.currentPrice;
        const won = (trade.side === 'Rise' && finalPrice > trade.entryPrice) || 
                   (trade.side === 'Fall' && finalPrice < trade.entryPrice);
        
        const pnl = won ? trade.amount * trade.payoutPct : -trade.amount;
        
        const updatedTrade: Trade = {
          ...trade,
          exitTime: Date.now(),
          exitPrice: finalPrice,
          pnl,
          status: won ? 'won' : 'lost'
        };
        
        set((state) => ({
          trades: state.trades.map(t => t.id === tradeId ? updatedTrade : t)
        }));
        
        get().updateBalance(pnl);
        get().addLog({
          time: Date.now(),
          level: won ? 'info' : 'warn',
          message: `Trade ${won ? 'won' : 'lost'}: ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`
        });
      }
    }),
    {
      name: 'trading-store',
      partialize: (state) => ({
        settings: state.settings,
        balance: state.balance,
        balancePercent: state.balancePercent
      })
    }
  )
);
