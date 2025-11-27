import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Inventory System</h2>
      </div>
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            <i>📊</i>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/products" className={`nav-link ${isActive('/products')}`}>
            <i>📦</i>
            Products
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/suppliers" className={`nav-link ${isActive('/suppliers')}`}>
            <i>🏢</i>
            Suppliers
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/inventory-logs" className={`nav-link ${isActive('/inventory-logs')}`}>
            <i>📋</i>
            Inventory Logs
          </Link>
        </li>
        {user && user.role === 'ADMIN' && (
          <li className="nav-item">
            <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
              <i>📈</i>
              Reports
            </Link>
          </li>
        )}
      </ul>

      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user?.name)}
          </div>
          <div>
            <div>{user?.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {user?.role}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
