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
  WifiOff,
  LogOut,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTradingStore } from '../store/tradingStore';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  const { balance } = useTradingStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Navigation will be handled by the route protection
  };

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

            {/* Deriv Connection Status */}
            {user?.isDerivConnected && (
              <div className="d-flex align-items-center gap-1">
                <Shield size={16} className="text-teal" />
                <span className="text-teal small d-none d-lg-inline">Deriv Connected</span>
              </div>
            )}
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
            
            <Link to="/deriv-auth" className="btn btn-outline-light btn-sm">
              <Settings size={16} />
            </Link>
            
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
                {user?.name} ${balance.toFixed(0)}
              </button>
              <ul className="dropdown-menu dropdown-menu-end bg-card border-dark">
                <li>
                  <div className="dropdown-item-text text-white">
                    <div className="fw-medium">{user?.name}</div>
                    <div className="small text-gray">{user?.email}</div>
                  </div>
                </li>
                <li><hr className="dropdown-divider border-dark" /></li>
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
                <li><hr className="dropdown-divider border-dark" /></li>
                <li>
                  <Link to="/deriv-auth" className="dropdown-item text-white d-flex align-items-center gap-2">
                    <Shield size={16} />
                    {user?.isDerivConnected ? 'Manage Deriv Connection' : 'Connect Deriv Account'}
                  </Link>
                </li>
                <li>
                  <button 
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="dropdown d-lg-none">
            <button 
              className="btn btn-outline-light dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Menu size={20} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end bg-card border-dark">
              <li>
                <div className="dropdown-item-text text-white">
                  <div className="fw-medium">{user?.name}</div>
                  <div className="small text-gray">${balance.toFixed(2)}</div>
                </div>
              </li>
              <li><hr className="dropdown-divider border-dark" /></li>
              <li>
                <Link to="/deriv-auth" className="dropdown-item text-white">
                  <Shield size={16} className="me-2" />
                  Deriv Settings
                </Link>
              </li>
              <li>
                <button 
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-2" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
