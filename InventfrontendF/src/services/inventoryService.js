import api from './api';

export const inventoryService = {
  getAllLogs: async () => {
    const response = await api.get('/inventory/logs');
    return response.data;
  },

  createInventoryLog: async (logData) => {
    const response = await api.post('/inventory/logs', logData);
    return response.data;
  },

  getInventoryStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  getInventoryReports: async () => {
    const response = await api.get('/inventory/reports');
    return response.data;
  },

  updateStock: async (productId, quantity, type, notes) => {
    const response = await api.post('/inventory/update-stock', {
      productId,
      quantity,
      type, // 'IN' or 'OUT'
      notes
    });
    return response.data;
  }
};
