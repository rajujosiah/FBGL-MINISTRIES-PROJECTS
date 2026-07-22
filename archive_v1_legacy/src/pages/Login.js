import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/login.css';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Redirect based on user role
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">FBGL</span>
          </div>
          <h2 className="login-title">
            Sign in to your account
          </h2>
          <p className="login-subtitle">
            Access your ministry dashboard
          </p>
        </div>

        <div className="login-form-container">
          <div className="login-form-card">
            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <div className="login-field">
                <label htmlFor="email" className="login-field-label">
                  Email address
                </label>
                <div className="login-input-container">
                  <div className="login-input-icon">
                    <Mail className="login-input-icon-svg" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-field-label">
                  Password
                </label>
                <div className="login-input-container">
                  <div className="login-input-icon">
                    <Lock className="login-input-icon-svg" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="login-password-toggle-icon" />
                    ) : (
                      <Eye className="login-password-toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-submit">
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                >
                  {loading ? (
                    <div className="login-submit-spinner"></div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="login-footer">
              <div className="login-divider">
                <div className="login-divider-line"></div>
                <div className="login-divider-text">
                  <span className="login-divider-text-content">Need help?</span>
                </div>
              </div>

              <div className="login-back">
                <Link
                  to="/"
                  className="login-back-link"
                >
                  <ArrowLeft className="login-back-icon" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
