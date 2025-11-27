import React, { useEffect, useMemo, useState } from 'react';
import { supplierService } from '../services/supplierService';

const initialForm = {
  name: '',
  contactInfo: '',
  email: '',
  address: '',
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
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
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (e) {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supplierService.updateSupplier(editingId, form);
      } else {
        await supplierService.createSupplier(form);
      }
      setForm(initialForm);
      setEditingId(null);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    }
  };

  const onEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      contactInfo: s.contactInfo || '',
      email: s.email || '',
      address: s.address || '',
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await supplierService.deleteSupplier(id);
      load();
    } catch (e) {
      setError('Delete failed');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.address?.toLowerCase().includes(q)
    );
  }, [suppliers, search]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <div className="page-actions">
          <input
            className="form-control"
            placeholder="Search by name, email, address"
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
              <h3 className="card-title">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
            </div>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" className="form-control" value={form.name} onChange={onChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Info</label>
                <input name="contactInfo" className="form-control" value={form.contactInfo} onChange={onChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" className="form-control" value={form.email} onChange={onChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input name="address" className="form-control" value={form.address} onChange={onChange} />
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
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.contactInfo}</td>
                      <td>{s.address}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit" onClick={() => onEdit(s)}>Edit</button>
                          <button className="action-btn delete" onClick={() => onDelete(s.id)}>Delete</button>
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

export default Suppliers;
