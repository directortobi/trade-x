import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Dashboard from './Dashboard';
import { useRealtime } from '../hooks/useRealtime';
import { useAuthStore } from '../store/authStore';
import { derivApi } from '../services/derivApi';

const DashboardApp: React.FC = () => {
  const { isConnected, connectionError, reconnect } = useRealtime();
  const { user } = useAuthStore();

  useEffect(() => {
    console.log('TradeProfX Dashboard initialized with Deriv API integration');
    
    // If user has a Deriv token, authorize the API connection
    if (user?.derivToken && user.derivToken !== 'YOUR_API_KEY') {
      derivApi.authorize(user.derivToken).catch(error => {
        console.warn('Failed to authorize with stored Deriv token:', error);
      });
    }
  }, [user?.derivToken]);

  return (
    <div className="bg-dark min-vh-100">
      <Header isConnected={isConnected} />
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
            {user?.isDerivConnected && (
              <span className="ms-2 badge bg-light text-dark">
                Account Connected
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardApp;
