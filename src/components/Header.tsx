import React from 'react';
import { 
  DollarSign, 
  Monitor, 
  Play, 
  HelpCircle, 
  Settings, 
  Bell, 
  Menu,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  const { balance } = useTradingStore();

  return (
    <nav className="bg-dark border-bottom border-dark sticky-top">
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center justify-content-between py-2">
          {/* Logo */}
          <div className="d-flex align-items-center gap-3">
            <h3 className="text-white mb-0 fw-bold me-4">TRADEPROFX</h3>
            
            {/* Connection Status */}
            <div className="d-flex align-items-center gap-1">
              {isConnected ? (
                <>
                  <Wifi size={16} className="text-success" />
                  <span className="text-success small d-none d-md-inline">Live</span>
                </>
              ) : (
                <>
                  <WifiOff size={16} className="text-warning" />
                  <span className="text-warning small d-none d-md-inline">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2">
              <DollarSign size={16} />
              Deposit
            </button>
            
            <button className="btn btn-teal btn-sm d-flex align-items-center gap-2">
              <Monitor size={16} />
              Dashboard
            </button>
            
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2">
              <Play size={16} />
              Videos
            </button>
            
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2">
              <HelpCircle size={16} />
              Support
            </button>
            
            <button className="btn btn-outline-light btn-sm">
              <Settings size={16} />
            </button>
            
            <button className="btn btn-outline-light btn-sm">
              <Bell size={16} />
            </button>

            {/* Account Balance */}
            <div className="dropdown">
              <button 
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Real account ${balance.toFixed(0)}
              </button>
              <ul className="dropdown-menu bg-card border-dark">
                <li>
                  <a className="dropdown-item text-white" href="#">
                    Real account ${balance.toFixed(2)}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-white" href="#">
                    Demo account $10,000
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          <button className="btn btn-outline-light d-lg-none">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
