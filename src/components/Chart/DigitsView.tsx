import React from 'react';
import { useTradingStore } from '../../store/tradingStore';

const DigitsView: React.FC = () => {
  const { currentPrice } = useTradingStore();
  
  const priceDigits = currentPrice.toString().replace('.', '').split('');
  const lastDigit = priceDigits[priceDigits.length - 1];

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4">
      <div className="text-center mb-4">
        <h3 className="text-white mb-2">Current Price</h3>
        <div className="display-4 text-teal fw-bold mb-3">
          {currentPrice.toFixed(4)}
        </div>
      </div>

      <div className="text-center">
        <h5 className="text-gray mb-3">Last Digit</h5>
        <div className="bg-card rounded-3 p-4 border border-dark">
          <div className="display-1 text-white fw-bold">
            {lastDigit}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <small className="text-gray">
          Digit prediction games can be based on the last digit of the price
        </small>
      </div>
    </div>
  );
};

export default DigitsView;
