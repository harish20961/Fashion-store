import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getAvailableProducts: () => api.get('/products/available'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  getOrdersByEmail: (email) => api.get(`/orders/email/${email}`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  createPaymentIntent: (paymentData) => api.post('/orders/payment/create-intent', paymentData),
  confirmPayment: (orderId, paymentIntentId) => api.post(`/orders/${orderId}/payment/confirm`, { paymentIntentId }),
  processOrderAutomation: (orderId) => api.post(`/orders/${orderId}/automation/process`),
};

export default api;
