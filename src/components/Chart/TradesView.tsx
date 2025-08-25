import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingStore } from '../../store/tradingStore';

const TradesView: React.FC = () => {
  const { trades } = useTradingStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
        return <span className="badge bg-success">Won</span>;
      case 'lost':
        return <span className="badge bg-danger">Lost</span>;
      case 'open':
        return <span className="badge bg-warning">Open</span>;
      case 'pending':
        return <span className="badge bg-secondary">Pending</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="h-100 p-3">
      <div className="mb-3">
        <h5 className="text-white">Trade History</h5>
        <p className="text-gray small mb-0">Recent trading activity</p>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Time</th>
              <th>Side</th>
              <th>Amount</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>P&L</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray py-4">
                  No trades yet. Start trading to see your history here.
                </td>
              </tr>
            ) : (
              trades.map(trade => (
                <tr key={trade.id}>
                  <td className="text-white small">
                    {new Date(trade.entryTime).toLocaleTimeString()}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      {trade.side === 'Rise' ? (
                        <TrendingUp size={16} className="text-success" />
                      ) : (
                        <TrendingDown size={16} className="text-danger" />
                      )}
                      <span className="text-white">{trade.side}</span>
                    </div>
                  </td>
                  <td className="text-white">${trade.amount}</td>
                  <td className="text-white">{trade.entryPrice.toFixed(4)}</td>
                  <td className="text-white">
                    {trade.exitPrice ? trade.exitPrice.toFixed(4) : '-'}
                  </td>
                  <td className={`fw-bold ${trade.pnl && trade.pnl > 0 ? 'text-success' : 'text-danger'}`}>
                    {trade.pnl ? `${trade.pnl > 0 ? '+' : ''}$${trade.pnl.toFixed(2)}` : '-'}
                  </td>
                  <td>
                    {getStatusBadge(trade.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradesView;
