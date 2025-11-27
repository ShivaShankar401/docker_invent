import React, { useEffect, useMemo, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';

const initialForm = {
  productId: '',
  type: 'IN',
  quantity: 0,
  notes: '',
};

const InventoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [logData, productData] = await Promise.all([
        inventoryService.getAllLogs(),
        productService.getAllProducts()
      ]);
      setLogs(logData);
      setProducts(productData);
    } catch (e) {
      setError('Failed to load inventory logs');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.updateStock(form.productId, form.quantity, form.type, form.notes);
      setForm(initialForm);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update stock');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter(l =>
      l.product?.name?.toLowerCase().includes(q) ||
      l.type?.toLowerCase().includes(q) ||
      String(l.quantity).includes(q)
    );
  }, [logs, search]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory Logs</h1>
        <div className="page-actions">
          <input
            className="form-control"
            placeholder="Search by product, type, quantity"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 280 }}
          />
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-5">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Update Stock</h3>
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Product</label>
                <select name="productId" className="form-control" value={form.productId} onChange={onChange}>
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select name="type" className="form-control" value={form.type} onChange={onChange}>
                      <option value="IN">Stock In</option>
                      <option value="OUT">Stock Out</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input name="quantity" type="number" className="form-control" value={form.quantity} onChange={onChange} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input name="notes" className="form-control" value={form.notes} onChange={onChange} />
              </div>
              <button className="btn btn-success" type="submit">Update</button>
            </form>
          </div>
        </div>

        <div className="col-7">
          <div className="data-table-container">
            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /><p>Loading...</p></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Notes</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id}>
                      <td>{l.product?.name || '-'}</td>
                      <td>
                        <span className={`status-badge ${l.type === 'IN' ? 'active' : 'inactive'}`}>{l.type}</span>
                      </td>
                      <td>{l.quantity}</td>
                      <td>{l.notes || '-'}</td>
                      <td>{new Date(l.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryLogs;
