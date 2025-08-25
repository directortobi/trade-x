import React from 'react';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useTradingStore } from '../../store/tradingStore';

const LogsView: React.FC = () => {
  const { logs } = useTradingStore();

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info size={16} className="text-info" />;
      case 'warn':
        return <AlertTriangle size={16} className="text-warning" />;
      case 'error':
        return <AlertCircle size={16} className="text-danger" />;
      default:
        return <Info size={16} className="text-info" />;
    }
  };

  const getLogClass = (level: string) => {
    switch (level) {
      case 'warn':
        return 'border-warning';
      case 'error':
        return 'border-danger';
      default:
        return 'border-info';
    }
  };

  return (
    <div className="h-100 p-3">
      <div className="mb-3">
        <h5 className="text-white">System Logs</h5>
        <p className="text-gray small mb-0">Robot activity and system messages</p>
      </div>

      <div className="log-container" style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <div className="text-center text-gray py-4">
            <Info size={48} className="mb-3 opacity-50" />
            <p>No logs yet. System messages will appear here.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {logs.map((log, index) => (
              <div 
                key={index}
                className={`card p-3 border-start border-3 ${getLogClass(log.level)}`}
              >
                <div className="d-flex align-items-start gap-2">
                  {getLogIcon(log.level)}
                  <div className="flex-grow-1">
                    <div className="text-white">{log.message}</div>
                    <small className="text-gray">
                      {new Date(log.time).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsView;
