import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus, HelpCircle } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';
import { markets, getMarketById } from '../data/markets';

const ManualTradingPanel: React.FC = () => {
  const [tradeType, setTradeType] = useState<'Rise' | 'Fall'>('Rise');
  const [duration, setDuration] = useState(1);
  const [amount, setAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  
  const { 
    balance, 
    balancePercent, 
    settings, 
    currentPrice,
    executeTrade,
    updateSettings 
  } = useTradingStore();

  const selectedMarket = getMarketById(settings.marketId);
  const payoutPct = 88.00;
  const payoutAmount = amount * (payoutPct / 100);

  const handleTrade = (side: 'Rise' | 'Fall') => {
    if (amount <= 0 || amount > balance) return;
    
    executeTrade(side, amount, multiplier, { value: duration, unit: 'Ticks' });
  };

  const StepperInput: React.FC<{
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }> = ({ value, onChange, min = 1, max = 1000, step = 1 }) => (
    <div className="d-flex">
      <button
        className="stepper-btn rounded-start"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        className="stepper-input flex-grow-1 border-start-0 border-end-0"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseFloat(e.target.value) || min)))}
        min={min}
        max={max}
        step={step}
      />
      <button
        className="stepper-btn rounded-end"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );

  return (
    <div className="h-100 p-3">
      <div className="mb-4">
        <h5 className="text-white mb-1">Manual mode</h5>
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
          {markets.map(market => (
            <option key={market.id} value={market.id}>
              {market.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Price Display */}
      <div className="mb-3">
        <div className="card p-2 text-center">
          <div className="text-teal fw-bold h5 mb-0">
            {currentPrice.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Trade Type */}
      <div className="mb-3">
        <label className="form-label text-gray small">Trade Type</label>
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className={`btn ${tradeType === 'Rise' ? 'btn-rise' : 'btn-outline-success'}`}
            onClick={() => setTradeType('Rise')}
          >
            <TrendingUp size={16} className="me-1" />
            Rise/Fall
          </button>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-3">
        <label className="form-label text-gray small d-flex align-items-center gap-1">
          Duration
          <HelpCircle size={14} className="text-gray" />
        </label>
        <div className="row">
          <div className="col-8">
            <StepperInput
              value={duration}
              onChange={setDuration}
              min={1}
              max={100}
            />
          </div>
          <div className="col-4">
            <select className="form-select">
              <option value="Ticks">Ticks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="form-label text-gray small">Amount</label>
        <StepperInput
          value={amount}
          onChange={setAmount}
          min={1}
          max={balance}
        />
      </div>

      {/* Stake Multiplier */}
      <div className="mb-4">
        <label className="form-label text-gray small">Stake Multiplier</label>
        <StepperInput
          value={multiplier}
          onChange={setMultiplier}
          min={1}
          max={1000}
        />
      </div>

      {/* Trade Buttons */}
      <div className="row g-2">
        <div className="col-6">
          <button
            className="btn btn-rise w-100 py-3"
            onClick={() => handleTrade('Rise')}
            disabled={amount <= 0 || amount > balance}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <TrendingUp size={20} />
              <div>
                <div className="fw-bold">Rise</div>
                <div className="small">{payoutPct.toFixed(2)}%</div>
                <div className="small">{payoutAmount.toFixed(2)} USD</div>
              </div>
            </div>
          </button>
        </div>
        <div className="col-6">
          <button
            className="btn btn-fall w-100 py-3"
            onClick={() => handleTrade('Fall')}
            disabled={amount <= 0 || amount > balance}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <TrendingDown size={20} />
              <div>
                <div className="fw-bold">Fall</div>
                <div className="small">{payoutPct.toFixed(2)}%</div>
                <div className="small">{payoutAmount.toFixed(2)} USD</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Balance Warning */}
      {amount > balance && (
        <div className="mt-3">
          <div className="alert alert-warning border-warning bg-transparent text-warning small mb-0">
            Insufficient balance. Maximum amount: ${balance.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualTradingPanel;
