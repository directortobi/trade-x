// src/hooks/useRealtime.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { derivApi } from '../services/derivApi';
import { getDerivSymbol } from '../data/markets';

// This hook manages the WebSocket connection and its state.
// It should be called only ONCE in the app (e.g., in App.tsx).
export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { settings, addTick } = useTradingStore(state => ({
    settings: state.settings,
    addTick: state.addTick,
  }));
  
  const activeSymbol = useRef<string | null>(null);

  const connect = useCallback(async () => {
    // Prevent multiple concurrent connection attempts
    if (derivApi['ws'] && derivApi['ws'].readyState === WebSocket.CONNECTING) {
        return;
    }
    setConnectionError(null);
    try {
      await derivApi.connect();
      setIsConnected(true);
      console.log('Deriv API connection established.');
    } catch (error) {
      console.error('[useRealtime] Failed to connect:', error);
      setIsConnected(false);
      setConnectionError('Failed to connect to live data feed.');
    }
  }, []);

  const reconnect = useCallback(() => {
    derivApi.close();
    setIsConnected(false);
    // Add a small delay to ensure the socket is fully closed before reconnecting
    setTimeout(() => connect(), 100);
  }, [connect]);

  // Effect for initial connection and cleanup
  useEffect(() => {
    connect();
    return () => {
      derivApi.close();
    };
  }, [connect]);

  // Effect for handling market subscription changes
  useEffect(() => {
    if (isConnected) {
      const newSymbol = getDerivSymbol(settings.marketId);
      
      if (newSymbol && newSymbol !== activeSymbol.current) {
        // Unsubscribe from the old symbol if there was one
        if (activeSymbol.current) {
          derivApi.forgetAllTicks();
        }
        
        // Subscribe to the new one
        derivApi.subscribeTicks(newSymbol, (price) => {
          addTick({ time: Date.now(), price });
        });
        activeSymbol.current = newSymbol;
        console.log(`Subscribed to ${newSymbol}`);
      }
    }
  }, [isConnected, settings.marketId, addTick]);

  return { isConnected, connectionError, reconnect };
}
