import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="text-white fw-bold mb-2">TRADEPROFX</h1>
          <p className="text-gray mb-0">Sign in to your account</p>
        </div>

        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger mb-3">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label text-gray small">
                Email Address
              </label>
              <div className="position-relative">
                <Mail className="position-absolute top-50 translate-middle-y ms-3 text-gray" size={20} />
                <input
                  id="email"
                  type="email"
                  className="form-control ps-5"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-gray small">
                Password
              </label>
              <div className="position-relative">
                <Lock className="position-absolute top-50 translate-middle-y ms-3 text-gray" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn p-0 position-absolute top-50 translate-middle-y end-0 me-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray" size={20} />
                  ) : (
                    <Eye className="text-gray" size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-teal w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray mb-0">
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal text-decoration-none">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-3 border-top border-dark">
            <div className="text-center">
              <small className="text-gray">
                Demo Credentials:<br />
                Email: demo@tradeprofx.com<br />
                Password: demo123
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
