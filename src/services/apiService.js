import { API_ENDPOINTS } from "../config/api";

/**
 * API Service for all HTTP requests
 * Handles authentication token, headers, and error handling
 */
export const apiService = {
  /**
   * GET Request
   * @param {string} endpoint - Full endpoint URL
   * @param {object} params - Query parameters
   * @param {boolean} withAuth - Include auth token (default: true)
   */
  get: async (endpoint, params = {}, withAuth = true) => {
    try {
      const headers = apiService.getHeaders(withAuth);

      // Build query string from params
      const url = new URL(endpoint);
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
        credentials: "include",
      });

      return apiService.handleResponse(response);
    } catch (error) {
      console.error("GET Error:", error);
      throw error;
    }
  },

  /**
   * POST Request
   * @param {string} endpoint - Full endpoint URL
   * @param {object} data - Request body data
   * @param {boolean} withAuth - Include auth token (default: true)
   */
  post: async (endpoint, data = {}, withAuth = true) => {
    try {
      const headers = apiService.getHeaders(withAuth);

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      return apiService.handleResponse(response);
    } catch (error) {
      console.error("POST Error:", error);
      throw error;
    }
  },

  /**
   * PUT Request
   * @param {string} endpoint - Full endpoint URL
   * @param {object} data - Request body data
   * @param {boolean} withAuth - Include auth token (default: true)
   */
  put: async (endpoint, data = {}, withAuth = true) => {
    try {
      const headers = apiService.getHeaders(withAuth);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
      });

      return apiService.handleResponse(response);
    } catch (error) {
      console.error("PUT Error:", error);
      throw error;
    }
  },

  /**
   * DELETE Request
   * @param {string} endpoint - Full endpoint URL
   * @param {boolean} withAuth - Include auth token (default: true)
   */
  delete: async (endpoint, withAuth = true) => {
    try {
      const headers = apiService.getHeaders(withAuth);

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      return apiService.handleResponse(response);
    } catch (error) {
      console.error("DELETE Error:", error);
      throw error;
    }
  },

  /**
   * Get authentication headers
   * @param {boolean} withAuth - Include auth token
   */
  getHeaders: (withAuth = true) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (withAuth) {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  },

  /**
   * Handle API response
   * @param {Response} response - Fetch response object
   */
  handleResponse: async (response) => {
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/login";
      }

      throw new Error(data.error || `HTTP Error: ${response.status}`);
    }

    return data;
  },

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  },

  /**
   * Get stored authentication token
   */
  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },
};

export default apiService;
