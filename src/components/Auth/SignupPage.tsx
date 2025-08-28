import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  
  const { signup, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passError = validatePassword(password);
    if (passError) {
      setPasswordError(passError);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    const success = await signup(name, email, password);
    if (success) {
      navigate('/deriv-auth');
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="text-white fw-bold mb-2">TRADEPROFX</h1>
          <p className="text-gray mb-0">Create your trading account</p>
        </div>

        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger mb-3">
                {error}
              </div>
            )}

            {passwordError && (
              <div className="alert alert-warning mb-3">
                {passwordError}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="name" className="form-label text-gray small">
                Full Name
              </label>
              <div className="position-relative">
                <User className="position-absolute top-50 translate-middle-y ms-3 text-gray" size={20} />
                <input
                  id="name"
                  type="text"
                  className="form-control ps-5"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-gray small">
                Password
              </label>
              <div className="position-relative">
                <Lock className="position-absolute top-50 translate-middle-y ms-3 text-gray" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5"
                  placeholder="Create a password"
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

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label text-gray small">
                Confirm Password
              </label>
              <div className="position-relative">
                <Lock className="position-absolute top-50 translate-middle-y ms-3 text-gray" size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn p-0 position-absolute top-50 translate-middle-y end-0 me-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-teal text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
