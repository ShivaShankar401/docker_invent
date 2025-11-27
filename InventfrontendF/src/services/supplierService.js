import api from './api';

export const supplierService = {
  getAllSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  updateSupplier: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  searchSuppliers: async (searchTerm) => {
    const response = await api.get(`/suppliers/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
};
