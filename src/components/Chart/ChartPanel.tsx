import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Grid3X3, 
  Camera, 
  Table, 
  Minus, 
  Plus,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock
} from 'lucide-react';
import { useTradingStore } from '../../store/tradingStore';
import { getMarketById } from '../../data/markets';
import LiveChart from './LiveChart';
import DigitsView from './DigitsView';
import TradesView from './TradesView';
import LogsView from './LogsView';

const ChartPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CHART' | 'DIGITS' | 'TRADES' | 'LOGS'>('CHART');
  const [timeframe, setTimeframe] = useState('1T');
  const [showGrid, setShowGrid] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  
  const { currentPrice, priceChange, priceChangePercent, settings } = useTradingStore();
  const selectedMarket = getMarketById(settings.marketId);

  const timeframes = ['1T', '1m', '5m', '15m', '1h', '4h', '1d'];
  
  const tools = [
    { id: 'trend', icon: TrendingUp, name: 'Trendline' },
    { id: 'horizontal', icon: Minus, name: 'Horizontal Line' },
    { id: 'vertical', icon: ArrowUp, name: 'Vertical Line' },
    { id: 'rectangle', icon: Grid3X3, name: 'Rectangle' },
    { id: 'circle', icon: ArrowDown, name: 'Circle' }
  ];

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleScreenshot = () => {
    // Screenshot functionality would be implemented here
    console.log('Taking screenshot...');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CHART':
        return <LiveChart />;
      case 'DIGITS':
        return <DigitsView />;
      case 'TRADES':
        return <TradesView />;
      case 'LOGS':
        return <LogsView />;
      default:
        return <LiveChart />;
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header with Tabs */}
      <div className="border-bottom border-dark">
        <div className="d-flex align-items-center justify-content-between p-3">
          <ul className="nav nav-tabs border-0 mb-0">
            {(['CHART', 'DIGITS', 'TRADES', 'LOGS'] as const).map(tab => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chart Controls */}
      {activeTab === 'CHART' && (
        <div className="border-bottom border-dark p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              {/* Timeframes */}
              <div className="d-flex gap-1">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    className={`btn btn-sm ${timeframe === tf ? 'btn-teal' : 'btn-outline-secondary'}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Tools */}
              <div className="d-flex align-items-center gap-2">
                <button 
                  className={`btn btn-sm ${showGrid ? 'btn-teal' : 'btn-outline-secondary'}`}
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid3X3 size={16} />
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <BarChart3 size={16} />
                  Indicators
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleScreenshot}
                >
                  <Camera size={16} />
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <Table size={16} />
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="d-flex align-items-center gap-1">
              <button className="btn btn-sm btn-outline-secondary">
                <Plus size={16} />
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <Minus size={16} />
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <ArrowLeft size={16} />
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow-1 position-relative">
        {activeTab === 'CHART' && (
          <div className="position-absolute start-0 top-0 h-100 d-flex flex-column p-2 gap-1">
            {tools.map(tool => (
              <div
                key={tool.id}
                className={`sidebar-tool ${activeTools.includes(tool.id) ? 'active' : ''}`}
                onClick={() => toggleTool(tool.id)}
                title={tool.name}
              >
                <tool.icon size={16} />
              </div>
            ))}
            <div className="mt-2">
              <div
                className={`sidebar-tool ${isLocked ? 'active' : ''}`}
                onClick={() => setIsLocked(!isLocked)}
                title={isLocked ? 'Unlock Chart' : 'Lock Chart'}
              >
                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </div>
            </div>
          </div>
        )}

        {/* Price Info (only for CHART tab) */}
        {activeTab === 'CHART' && (
          <div className="position-absolute top-0 start-0 m-3" style={{ left: '60px' }}>
            <div className="bg-dark bg-opacity-75 p-2 rounded">
              <div className="text-white fw-medium">
                {selectedMarket?.name} — Deriv
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-white fw-bold">
                  {currentPrice.toFixed(4)}
                </span>
                <span className={`small ${priceChange >= 0 ? 'price-positive' : 'price-negative'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={`h-100 ${activeTab === 'CHART' ? 'ps-5' : ''}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
