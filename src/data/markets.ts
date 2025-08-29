import { Market } from '../types';

export interface MarketGroup {
  name: string;
  markets: Market[];
}

const syntheticIndices: Market[] = [
  { id: 'R_100', name: 'Volatility 100 Index', group: 'Synthetics' },
  { id: 'R_75', name: 'Volatility 75 Index', group: 'Synthetics' },
  { id: 'R_50', name: 'Volatility 50 Index', group: 'Synthetics' },
  { id: 'R_25', name: 'Volatility 25 Index', group: 'Synthetics' },
  { id: 'R_10', name: 'Volatility 10 Index', group: 'Synthetics' },
  { id: 'CRASH500', name: 'Crash 500 Index', group: 'Synthetics' },
  { id: 'CRASH1000', name: 'Crash 1000 Index', group: 'Synthetics' },
  { id: 'BOOM500', name: 'Boom 500 Index', group: 'Synthetics' },
  { id: 'BOOM1000', name: 'Boom 1000 Index', group: 'Synthetics' },
  { id: 'STEPIND', name: 'Step Index', group: 'Synthetics' },
  { id: 'JUMP10', name: 'Jump 10 Index', group: 'Synthetics' },
  { id: 'JUMP25', name: 'Jump 25 Index', group: 'Synthetics' },
  { id: 'JUMP50', name: 'Jump 50 Index', group: 'Synthetics' },
];

const forexPairs: Market[] = [
  { id: 'frxEURUSD', name: 'EUR/USD', group: 'Forex' },
  { id: 'frxGBPUSD', name: 'GBP/USD', group: 'Forex' },
  { id: 'frxUSDJPY', name: 'USD/JPY', group: 'Forex' },
  { id: 'frxAUDUSD', name: 'AUD/USD', group: 'Forex' },
  { id: 'frxUSDCAD', name: 'USD/CAD', group: 'Forex' },
  { id: 'frxNZDUSD', name: 'NZD/USD', group: 'Forex' },
  { id: 'frxUSDCHF', name: 'USD/CHF', group: 'Forex' },
  { id: 'frxEURGBP', name: 'EUR/GBP', group: 'Forex' },
  { id: 'frxEURJPY', name: 'EUR/JPY', group: 'Forex' },
  { id: 'frxGBPJPY', name: 'GBP/JPY', group: 'Forex' },
];

const cryptoPairs: Market[] = [
  { id: 'cryBTCUSD', name: 'BTC/USD', group: 'Crypto' },
  { id: 'cryETHUSD', name: 'ETH/USD', group: 'Crypto' },
  { id: 'cryLTCUSD', name: 'LTC/USD', group: 'Crypto' },
  { id: 'cryBCHUSD', name: 'BCH/USD', group: 'Crypto' },
  { id: 'cryXRPUSD', name: 'XRP/USD', group: 'Crypto' },
];

const commodities: Market[] = [
  { id: 'XAUUSD', name: 'Gold/USD', group: 'Commodities' },
  { id: 'XAGUSD', name: 'Silver/USD', group: 'Commodities' },
  { id: 'WTIUSD', name: 'US Oil/USD', group: 'Commodities' },
];

const stockIndices: Market[] = [
  { id: 'US_30', name: 'Wall Street 30', group: 'Indices' },
  { id: 'US_100', name: 'US Tech 100', group: 'Indices' },
  { id: 'US_500', name: 'US 500', group: 'Indices' },
  { id: 'DE_40', name: 'Germany 40', group: 'Indices' },
  { id: 'UK_100', name: 'UK 100', group: 'Indices' },
];

export const marketGroups: MarketGroup[] = [
  { name: 'Synthetic Indices', markets: syntheticIndices },
  { name: 'Forex', markets: forexPairs },
  { name: 'Cryptocurrencies', markets: cryptoPairs },
  { name: 'Commodities', markets: commodities },
  { name: 'Stock Indices', markets: stockIndices },
];

export const allMarkets: Market[] = marketGroups.flatMap(group => group.markets);

export const getMarketBySymbol = (symbol: string): Market | undefined => {
  return allMarkets.find(market => market.id === symbol);
};

// This function is kept for backward compatibility if needed, but getMarketBySymbol is preferred
export const getMarketById = (id: string): Market | undefined => {
  return getMarketBySymbol(id);
};

// This map is no longer the primary source, but can be useful for lookups.
export const DERIV_SYMBOL_MAP: Record<string, string> = allMarkets.reduce((acc, market) => {
  acc[market.name] = market.id;
  return acc;
}, {} as Record<string, string>);

export const getDerivSymbol = (marketId: string): string | undefined => {
  const market = getMarketById(marketId);
  return market?.id;
};
