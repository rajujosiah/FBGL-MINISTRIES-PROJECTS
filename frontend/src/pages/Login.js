import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const roleDashboard = {
        'admin': '/dashboard/admin',
        'area_manager': '/dashboard/area-manager',
        'project_manager': '/dashboard/project-manager',
        'social_worker': '/dashboard/social-worker'
      };
      navigate(roleDashboard[user.role] || '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(username, password);

    if (result.success) {
      // Redirect to appropriate dashboard
      const roleDashboard = {
        'admin': '/dashboard/admin',
        'area_manager': '/dashboard/area-manager',
        'project_manager': '/dashboard/project-manager',
        'social_worker': '/dashboard/social-worker'
      };

      const from = location.state?.from?.pathname || '/';
      const redirectTo = roleDashboard[result.user.role] || '/dashboard';

      navigate(redirectTo, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="FBGL Ministries Logo"
              className="login-logo"
            />
            <h1>FBGL Ministries</h1>
            <h2>Login</h2>
            <p className="login-subtitle">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username / Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>First Born Gospel Life Ministries</p>
            <p className="copyright">© 2024 FBGL Ministries. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


