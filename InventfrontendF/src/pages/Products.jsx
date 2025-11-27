import React, { useEffect, useMemo, useState } from 'react';
import { productService } from '../services/productService';

const initialForm = {
  name: '',
  description: '',
  category: '',
  supplierId: '',
  quantity: 0,
  price: 0,
  warehouseLocation: '',
  reorderLevel: 0,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name.includes('quantity') || name.includes('price') || name.includes('reorderLevel') ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map supplierId to supplier object as expected by backend
      const payload = {
        ...form,
        supplier: form.supplierId ? { id: Number(form.supplierId) } : null,
      };

      if (editingId) {
        await productService.updateProduct(editingId, payload);
      } else {
        await productService.createProduct(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category || '',
      supplierId: p.supplier?.id || '',
      quantity: p.quantity || 0,
      price: p.price || 0,
      warehouseLocation: p.warehouseLocation || '',
      reorderLevel: p.reorderLevel || 0,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      load();
    } catch (e) {
      setError('Delete failed');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.supplier?.name?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div className="page-actions">
          <input
            className="form-control"
            placeholder="Search by name, category, supplier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 280 }}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" className="form-control" value={form.name} onChange={onChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input name="description" className="form-control" value={form.description} onChange={onChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input name="category" className="form-control" value={form.category} onChange={onChange} />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Supplier ID</label>
                    <input name="supplierId" className="form-control" value={form.supplierId} onChange={onChange} />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">Warehouse Location</label>
                    <input name="warehouseLocation" className="form-control" value={form.warehouseLocation} onChange={onChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input name="quantity" type="number" className="form-control" value={form.quantity} onChange={onChange} />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input name="price" type="number" step="0.01" className="form-control" value={form.price} onChange={onChange} />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label">Reorder Level</label>
                    <input name="reorderLevel" type="number" className="form-control" value={form.reorderLevel} onChange={onChange} />
                  </div>
                </div>
              </div>
              <div>
                <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" style={{ marginLeft: 10 }} onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-6">
          <div className="data-table-container">
            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /><p>Loading...</p></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Reorder</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.supplier?.name || '-'}</td>
                      <td>{p.quantity}</td>
                      <td>₹{p.price}</td>
                      <td>{p.reorderLevel}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit" onClick={() => onEdit(p)}>Edit</button>
                          <button className="action-btn delete" onClick={() => onDelete(p.id)}>Delete</button>
                        </div>
                      </td>
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

export default Products;
