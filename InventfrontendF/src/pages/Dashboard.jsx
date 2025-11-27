import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSuppliers: 0,
    totalValue: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all products to calculate stats
      const products = await productService.getAllProducts();
      const lowStock = await productService.getLowStockProducts();
      const logs = await inventoryService.getAllLogs();
      
      // Calculate stats
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const uniqueSuppliers = new Set(products.map(p => p.supplier?.id)).size;
      
      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        totalSuppliers: uniqueSuppliers,
        totalValue: totalValue
      });
      
      setLowStockProducts(lowStock.slice(0, 5)); // Show only first 5
      setRecentLogs(logs.slice(0, 5)); // Show only recent 5 logs
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
    datasets: [
      {
        label: 'Products by Category',
        data: [12, 19, 8, 15, 6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const stockLevelData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [stats.totalProducts - stats.lowStockProducts, stats.lowStockProducts, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="page-actions">
          <span className="welcome-text">Welcome back, {user?.name}!</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
          <div className="stat-change positive">+5% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.lowStockProducts}</div>
          <div className="stat-label">Low Stock Alerts</div>
          <div className="stat-change negative">Needs attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalSuppliers}</div>
          <div className="stat-label">Active Suppliers</div>
          <div className="stat-change positive">+2 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{stats.totalValue.toLocaleString()}</div>
          <div className="stat-label">Total Inventory Value</div>
          <div className="stat-change positive">+12% from last month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-8">
          <div className="chart-container">
            <h3 className="chart-title">Products by Category</h3>
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
        <div className="col-4">
          <div className="chart-container">
            <h3 className="chart-title">Stock Levels</h3>
            <Doughnut data={stockLevelData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Low Stock Alerts</h3>
              <Link to="/products" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            {lowStockProducts.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Current Stock</th>
                      <th>Reorder Level</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.reorderLevel}</td>
                        <td>
                          <span className="status-badge low-stock">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No low stock alerts at the moment.</p>
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Inventory Activity</h3>
              <Link to="/inventory-logs" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            {recentLogs.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.product?.name || 'Unknown'}</td>
                        <td>
                          <span className={`status-badge ${log.type === 'IN' ? 'active' : 'inactive'}`}>
                            {log.type}
                          </span>
                        </td>
                        <td>{log.quantity}</td>
                        <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No recent inventory activity.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="row">
          <div className="col-3">
            <Link to="/products" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              📦 Manage Products
            </Link>
          </div>
          <div className="col-3">
            <Link to="/suppliers" className="btn btn-secondary btn-lg" style={{ width: '100%' }}>
              🏢 Manage Suppliers
            </Link>
          </div>
          <div className="col-3">
            <Link to="/inventory-logs" className="btn btn-success btn-lg" style={{ width: '100%' }}>
              📋 Update Stock
            </Link>
          </div>
          {user?.role === 'ADMIN' && (
            <div className="col-3">
              <Link to="/reports" className="btn btn-warning btn-lg" style={{ width: '100%' }}>
                📈 View Reports
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
