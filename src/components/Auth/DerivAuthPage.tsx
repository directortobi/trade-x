import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, AlertCircle, CheckCircle, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { derivApi } from '../../services/derivApi';

const DerivAuthPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  
  const { user, setDerivToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const validateToken = async (tokenToValidate: string) => {
    if (!tokenToValidate.trim()) {
      setValidationError('');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      // Connect to Deriv API and try to authorize with the token
      await derivApi.connect();
      await derivApi.authorize(tokenToValidate);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
      setValidationError('Invalid token. Please check your Deriv API token and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateToken(value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      setValidationError('Please enter a valid Deriv API token');
      return;
    }

    setDerivToken(token);
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-teal rounded-circle p-3 mb-3">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-white fw-bold mb-2">Connect Your Deriv Account</h1>
          <p className="text-gray mb-0">
            Securely connect your Deriv trading account to enable live trading
          </p>
        </div>

        <div className="card p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="token" className="form-label text-gray small d-flex align-items-center gap-2">
                <Key size={16} />
                Deriv API Token
              </label>
              <div className="position-relative">
                <input
                  id="token"
                  type="password"
                  className={`form-control pe-5 ${
                    token && (isValid ? 'border-success' : validationError ? 'border-danger' : '')
                  }`}
                  placeholder="Enter your Deriv API token"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                />
                <div className="position-absolute top-50 translate-middle-y end-0 me-3">
                  {isValidating ? (
                    <Loader2 size={20} className="text-warning spin" />
                  ) : isValid ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : validationError ? (
                    <AlertCircle size={20} className="text-danger" />
                  ) : null}
                </div>
              </div>
              
              {validationError && (
                <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                  <AlertCircle size={14} />
                  {validationError}
                </div>
              )}
              
              {isValid && (
                <div className="text-success small mt-2 d-flex align-items-center gap-1">
                  <CheckCircle size={14} />
                  Token validated successfully!
                </div>
              )}
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-teal flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                disabled={!isValid || isValidating}
              >
                Connect Account
                <ArrowRight size={16} />
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleSkip}
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="card p-4">
          <h6 className="text-white mb-3">How to get your Deriv API token:</h6>
          <ol className="text-gray small mb-3 ps-3">
            <li className="mb-2">
              Go to{' '}
              <a 
                href="https://app.deriv.com/account/api-token" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal text-decoration-none d-inline-flex align-items-center gap-1"
              >
                Deriv API Token page
                <ExternalLink size={12} />
              </a>
            </li>
            <li className="mb-2">Create a new token with trading permissions</li>
            <li className="mb-2">Copy the generated token</li>
            <li>Paste it in the field above</li>
          </ol>
          
          <div className="alert alert-warning border-warning bg-transparent text-warning small mb-0">
            <AlertCircle size={16} className="me-2" />
            <strong>Security Note:</strong> Your token is stored locally and used only to connect to your Deriv account. 
            We never store or transmit your token to external servers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivAuthPage;
