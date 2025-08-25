import { Market } from '../types';

export const markets: Market[] = [
  {
    id: 'volatility-100',
    name: 'Volatility 100 Index',
    tooltip: 'Constant volatility of 100% with a tick every 2 seconds'
  },
  {
    id: 'volatility-75',
    name: 'Volatility 75 Index',
    tooltip: 'Constant volatility of 75% with a tick every 2 seconds'
  },
  {
    id: 'volatility-50',
    name: 'Volatility 50 Index',
    tooltip: 'Constant volatility of 50% with a tick every 2 seconds'
  },
  {
    id: 'boom-1000',
    name: 'Boom 1000 Index',
    tooltip: 'Simulates a market with constant upward spikes'
  },
  {
    id: 'crash-1000',
    name: 'Crash 1000 Index',
    tooltip: 'Simulates a market with constant downward spikes'
  }
];

// Map our internal market IDs to Deriv symbols for API calls
export const DERIV_SYMBOL_MAP: Record<string, string> = {
  'volatility-100': 'R_100',
  'volatility-75': 'R_75',
  'volatility-50': 'R_50',
  'boom-1000': 'BOOM1000',
  'crash-1000': 'CRASH1000'
};

export const getMarketById = (id: string): Market | undefined => {
  return markets.find(market => market.id === id);
};

export const getDerivSymbol = (marketId: string): string | undefined => {
  return DERIV_SYMBOL_MAP[marketId];
};
