import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import InventoryLogs from './pages/InventoryLogs';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router basename='/inventory_management'>
      <div className="app">
        {user && <Navbar />}
        <div className={user ? "main-content" : "full-content"}>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/products" 
              element={user ? <Products /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/suppliers" 
              element={user ? <Suppliers /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/inventory-logs" 
              element={user ? <InventoryLogs /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={user && user.role === 'ADMIN' ? <Reports /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
