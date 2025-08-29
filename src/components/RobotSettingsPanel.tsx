import React from 'react';
import { Play, Square, Shield, ChevronRight, TrendingUp } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';
import { marketGroups, getMarketBySymbol } from '../data/markets';

const RobotSettingsPanel: React.FC = () => {
  const { 
    balance, 
    balancePercent, 
    isRobotRunning, 
    settings, 
    updateSettings, 
    startRobot, 
    stopRobot 
  } = useTradingStore();

  const selectedMarket = getMarketBySymbol(settings.marketId);

  const handleStartStop = () => {
    if (isRobotRunning) {
      stopRobot();
    } else {
      startRobot();
    }
  };

  return (
    <div className="h-100 p-3">
      <div className="mb-4">
        <h5 className="text-white mb-1">Robot settings</h5>
        <div className="text-white h4 mb-0">
          ${balance.toFixed(0)} 
          <span className={`ms-2 fs-6 ${balancePercent >= 0 ? 'text-success' : 'text-danger'}`}>
            ({balancePercent >= 0 ? '+' : ''}{balancePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Market Selection */}
      <div className="mb-3">
        <label className="form-label text-gray small">Market</label>
        <select 
          className="form-select"
          value={settings.marketId}
          onChange={(e) => updateSettings({ marketId: e.target.value })}
        >
          {marketGroups.map(group => (
            <optgroup key={group.name} label={group.name}>
              {group.markets.map(market => (
                <option key={market.id} value={market.id}>
                  {market.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedMarket?.tooltip && (
          <small className="text-teal d-block mt-1">
            {selectedMarket.tooltip}
          </small>
        )}
      </div>

      {/* Strategy */}
      <div className="mb-3">
        <label className="form-label text-gray small">Strategy</label>
        <select 
          className="form-select"
          value={settings.strategy}
          onChange={(e) => updateSettings({ strategy: e.target.value as any })}
        >
          <option value="NeuroBot">NeuroBot</option>
          <option value="TrendBot">TrendBot</option>
          <option value="MeanReversionBot">MeanReversionBot</option>
        </select>
      </div>

      {/* Trading Mode */}
      <div className="mb-3">
        <label className="form-label text-gray small">Trading mode</label>
        <select 
          className="form-select"
          value={settings.mode}
          onChange={(e) => updateSettings({ mode: e.target.value as any })}
        >
          <option value="Faster">⚡ Faster</option>
          <option value="Balanced">⚖️ Balanced</option>
          <option value="Safer">🛡️ Safer</option>
        </select>
        <small className="text-gray d-block mt-1">
          {settings.mode === 'Faster' && 'More trades, less accuracy'}
          {settings.mode === 'Balanced' && 'Balanced trades and accuracy'}
          {settings.mode === 'Safer' && 'Fewer trades, higher accuracy'}
        </small>
      </div>

      {/* Amount, Target Profit, Stop Loss */}
      <div className="row mb-3">
        <div className="col-4">
          <label className="form-label text-gray small">Amount</label>
          <div className="input-group">
            <span className="input-group-text bg-card border-dark text-gray">$</span>
            <input 
              type="number" 
              className="form-control"
              value={settings.amount}
              onChange={(e) => updateSettings({ amount: parseFloat(e.target.value) || 1 })}
              min="1"
            />
          </div>
        </div>
        <div className="col-4">
          <label className="form-label text-gray small">Target profit</label>
          <div className="input-group">
            <span className="input-group-text bg-card border-dark text-gray">$</span>
            <input 
              type="number" 
              className="form-control"
              value={settings.targetProfit}
              onChange={(e) => updateSettings({ targetProfit: parseFloat(e.target.value) || 20 })}
              min="1"
            />
          </div>
        </div>
        <div className="col-4">
          <label className="form-label text-gray small">Stop Loss</label>
          <div className="input-group">
            <span className="input-group-text bg-card border-dark text-gray">$</span>
            <input 
              type="number" 
              className="form-control"
              value={settings.stopLoss}
              onChange={(e) => updateSettings({ stopLoss: parseFloat(e.target.value) || 1000 })}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="mb-4">
        <label className="form-label text-gray small">Risk Management</label>
        <select 
          className="form-select"
          value={settings.riskManagement}
          onChange={(e) => updateSettings({ riskManagement: e.target.value as any })}
        >
          <option value="Conservative">Conservative - Low risk</option>
          <option value="Moderate">Moderate - Balanced</option>
          <option value="Aggressive">Aggressive - High risk</option>
        </select>
      </div>

      {/* Start/Stop Button */}
      <button 
        className={`btn w-100 btn-lg d-flex align-items-center justify-content-center gap-2 ${
          isRobotRunning ? 'btn-danger' : 'btn-teal'
        }`}
        onClick={handleStartStop}
      >
        {isRobotRunning ? (
          <>
            <Square size={20} />
            Stop robot
          </>
        ) : (
          <>
            <Play size={20} />
            Start robot
          </>
        )}
      </button>
    </div>
  );
};

export default RobotSettingsPanel;
