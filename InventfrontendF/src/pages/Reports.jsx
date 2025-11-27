import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventoryReports();
      setReports(data);
    } catch (e) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    // Use relative path so the CRA proxy routes to backend (port 7090)
    window.location.href = '/api/inventory/reports/export/csv';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <div className="page-actions">
          <button className="btn btn-warning" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /><p>Loading...</p></div>
      ) : reports ? (
        <div className="row">
          <div className="col-4">
            <div className="stat-card">
              <div className="stat-number">{reports.turnoverRate?.toFixed(2) || 0}</div>
              <div className="stat-label">Inventory Turnover Rate</div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card">
              <div className="stat-number">₹{reports.stockValuation?.toLocaleString() || 0}</div>
              <div className="stat-label">Stock Valuation</div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card">
              <div className="stat-number">{reports.fastMoving?.length || 0}</div>
              <div className="stat-label">Fast-moving Products</div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Fast-moving Products</h3>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.fastMoving?.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.supplier?.name || '-'}</td>
                      <td>{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Slow-moving Products</h3>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slowMoving?.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.supplier?.name || '-'}</td>
                      <td>{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>No report data.</p>
      )}
    </div>
  );
};

export default Reports;
