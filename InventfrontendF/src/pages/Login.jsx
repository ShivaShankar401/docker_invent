import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@inventory.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'staff@inventory.com',
        password: 'staff123'
      });
    }
    setError('');
  };

  const createDemoUsers = async () => {
    try {
      setLoading(true);
      setError('');
      // Try to register Admin
      try {
        await authService.register({
          name: 'Admin',
          email: 'admin@inventory.com',
          password: 'admin123',
          role: 'ADMIN'
        });
      } catch (e) {
        // ignore if already exists
      }
      // Try to register Staff
      try {
        await authService.register({
          name: 'Staff',
          email: 'staff@inventory.com',
          password: 'staff123',
          role: 'STAFF'
        });
      } catch (e) {
        // ignore if already exists
      }
      setError('Demo users are ready. Use the buttons below to autofill credentials.');
    } catch (err) {
      setError('Could not create demo users. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Inventory Management System</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemoCredentials('admin')}
              disabled={loading}
            >
              Admin Login
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemoCredentials('staff')}
              disabled={loading}
            >
              Staff Login
            </button>
          </div>
          <div className="demo-setup" style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={createDemoUsers}
              disabled={loading}
            >
              Create Demo Users
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2025 Inventory Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
