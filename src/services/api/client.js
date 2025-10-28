/**
 * API Client - HTTP client untuk komunikasi dengan backend
 * Mendukung mode mock (development) dan real API (production)
 * Switchable via environment variable VITE_USE_MOCK
 */

import mockApiClient from './mockClient';

// Konfigurasi dari environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Real API Client - Menggunakan fetch untuk HTTP requests
 */
const realApiClient = {
  /**
   * GET request dengan support query parameters
   * @param {string} endpoint - API endpoint path
   * @param {object} options - { params: {}, responseType: 'json'|'blob' }
   */
  get: async (endpoint, options = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Tambahkan query parameters jika ada
    if (options.params) {
      Object.keys(options.params).forEach(key => {
        if (options.params[key] !== undefined) {
          url.searchParams.append(key, options.params[key]);
        }
      });
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // Return blob untuk file downloads
    if (options.responseType === 'blob') {
      return response.blob();
    }
    return response.json();
  },

  /**
   * POST request dengan JSON body
   */
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  /**
   * PUT request untuk update data
   */
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  /**
   * DELETE request untuk hapus data
   */
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  /**
   * Upload file dengan FormData
   * Tidak set Content-Type agar browser set multipart/form-data otomatis
   */
  upload: async (endpoint, formData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData, // FormData untuk file upload
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};

// Export client sesuai mode (mock atau real)
const apiClient = USE_MOCK ? mockApiClient : realApiClient;

export default apiClient;
