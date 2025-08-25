import React, { useEffect } from 'react';
import RobotSettingsPanel from './RobotSettingsPanel';
import ChartPanel from './Chart/ChartPanel';
import ManualTradingPanel from './ManualTradingPanel';
import { useTradingStore } from '../store/tradingStore';

const Dashboard: React.FC = () => {
  const { trades, resolveTrade } = useTradingStore(state => ({
    trades: state.trades,
    resolveTrade: state.resolveTrade
  }));

  // Effect to handle trade resolution
  useEffect(() => {
    const tradeResolverInterval = setInterval(() => {
      const openTrades = trades.filter(t => t.status === 'open');
      
      openTrades.forEach(trade => {
        const durationMs = trade.duration.value * 2000; // 2 seconds per tick
        if (Date.now() >= trade.entryTime + durationMs) {
          resolveTrade(trade.id);
        }
      });
    }, 1000); // Check every second

    return () => {
      clearInterval(tradeResolverInterval);
    };
  }, [trades, resolveTrade]);

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left Panel - Robot Settings */}
        <div className="col-12 col-lg-3 border-end border-dark">
          <div className="bg-card h-100">
            <RobotSettingsPanel />
          </div>
        </div>

        {/* Center Panel - Chart */}
        <div className="col-12 col-lg-6 border-end border-dark">
          <div className="bg-card h-100">
            <ChartPanel />
          </div>
        </div>

        {/* Right Panel - Manual Trading */}
        <div className="col-12 col-lg-3">
          <div className="bg-card h-100">
            <ManualTradingPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
