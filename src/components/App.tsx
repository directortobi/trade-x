import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Dashboard from './Dashboard';
import { useRealtime } from '../hooks/useRealtime';

const App: React.FC = () => {
  const { isConnected, connectionError, reconnect } = useRealtime();

  useEffect(() => {
    console.log('TradeProfX Dashboard initialized with Deriv API integration');
  }, []);

  return (
    <div className="bg-dark min-vh-100">
      <Header />
      <main>
        <Dashboard />
      </main>
      
      {/* Connection Status Indicators */}
      {connectionError && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
          <div className="alert alert-warning mb-0 d-flex align-items-center gap-2">
            <small>{connectionError}</small>
            <button 
              className="btn btn-sm btn-warning ms-2"
              onClick={reconnect}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!isConnected && !connectionError && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
          <div className="alert alert-info mb-0">
            <small>Connecting to live market data...</small>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="position-fixed bottom-0 end-0 me-3 mb-3">
          <div className="bg-success text-white px-2 py-1 rounded small">
            <span className="me-1">●</span>
            Live Data
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
