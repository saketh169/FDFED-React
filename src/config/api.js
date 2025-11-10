// API base URL configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },

  // Dietitian endpoints
  DIETITIANS: {
    GET_ALL: `${API_BASE_URL}/dietitians`,
    GET_BY_ID: (id) => `${API_BASE_URL}/dietitians/${id}`,
    GET_SLOTS: (id) => `${API_BASE_URL}/dietitians/${id}/slots`,
    GET_BOOKED_SLOTS: (id) => `${API_BASE_URL}/dietitians/${id}/booked-slots`,
  },

  // Booking endpoints
  BOOKINGS: {
    CREATE: `${API_BASE_URL}/bookings`,
    GET_USER: `${API_BASE_URL}/bookings`,
    GET_BY_ID: (id) => `${API_BASE_URL}/bookings/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/bookings/${id}/cancel`,
    GET_STATUS: (id) => `${API_BASE_URL}/bookings/${id}/status`,
  },

  // Payment endpoints
  PAYMENTS: {
    PROCESS: `${API_BASE_URL}/payments/process`,
    VERIFY: `${API_BASE_URL}/payments/verify`,
    GET_TRANSACTIONS: `${API_BASE_URL}/payments/transactions`,
  },
};

export default API_BASE_URL;
