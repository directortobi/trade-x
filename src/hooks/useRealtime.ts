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
  const connectionTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async () => {
    // Prevent multiple concurrent connection attempts
    if (derivApi.connectionState === 'CONNECTING') {
      return;
    }

    setConnectionError(null);
    
    // Set a connection timeout
    if (connectionTimeout.current) {
      clearTimeout(connectionTimeout.current);
    }
    
    connectionTimeout.current = setTimeout(() => {
      if (!derivApi.isConnected) {
        setConnectionError('Connection timeout - please check your internet connection');
      }
    }, 10000); // 10 second timeout

    try {
      await derivApi.connect();
      setIsConnected(true);
      setConnectionError(null);
      console.log('Deriv API connection established successfully');
      
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
    } catch (error) {
      console.error('[useRealtime] Failed to connect:', error);
      setIsConnected(false);
      
      let errorMessage = 'Failed to connect to live data feed';
      
      if (error instanceof Error) {
        if (error.message.includes('WebSocket connection failed')) {
          errorMessage = 'Unable to connect to Deriv servers. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setConnectionError(errorMessage);
      
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
    }
  }, []);

  const reconnect = useCallback(() => {
    console.log('Manual reconnection requested');
    setIsConnected(false);
    setConnectionError(null);
    derivApi.close();
    
    // Add a small delay to ensure the socket is fully closed before reconnecting
    setTimeout(() => {
      connect();
    }, 500);
  }, [connect]);

  // Effect for initial connection and cleanup
  useEffect(() => {
    connect();
    
    return () => {
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
      }
      derivApi.close();
    };
  }, [connect]);

  // Monitor connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const connected = derivApi.isConnected;
      if (connected !== isConnected) {
        setIsConnected(connected);
        if (!connected && !connectionError) {
          setConnectionError('Connection lost - attempting to reconnect...');
        }
      }
    }, 1000);

    return () => clearInterval(checkConnection);
  }, [isConnected, connectionError]);

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
        try {
          derivApi.subscribeTicks(newSymbol, (price) => {
            addTick({ time: Date.now(), price });
          });
          activeSymbol.current = newSymbol;
          console.log(`Successfully subscribed to ${newSymbol}`);
        } catch (error) {
          console.error(`Failed to subscribe to ${newSymbol}:`, error);
          setConnectionError(`Failed to subscribe to market data for ${newSymbol}`);
        }
      }
    }
  }, [isConnected, settings.marketId, addTick]);

  return { isConnected, connectionError, reconnect };
}
