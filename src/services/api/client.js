/**
 * API Client - HTTP client untuk komunikasi dengan backend
 * Mendukung mode mock (development) dan real API (production)
 * Switchable via environment variable VITE_USE_MOCK
 */

import mockApiClient from './mockClient';

// Konfigurasi dari environment variables
const API_BASE_URL = import.meta.env.MAIN_SERVICE_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.USE_MOCK === 'true';

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
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Tambahkan Authorization header jika ada token
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 API GET:', url.toString(), { params: options.params, headers });
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('✅ Response:', response.status, response.statusText);
    
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
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Tambahkan Authorization header jika ada token
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 API POST:', `${API_BASE_URL}${endpoint}`, { data, headers });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    console.log('✅ Response:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    return response.json();
  },

  /**
   * PUT request untuk update data
   */
  put: async (endpoint, data) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Tambahkan Authorization header jika ada token
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 API PUT:', `${API_BASE_URL}${endpoint}`, { data, headers });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    console.log('✅ Response:', response.status, response.statusText);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  /**
   * DELETE request untuk hapus data
   */
  delete: async (endpoint) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Tambahkan Authorization header jika ada token
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 API DELETE:', `${API_BASE_URL}${endpoint}`, { headers });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    console.log('✅ Response:', response.status, response.statusText);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  /**
   * Upload file dengan FormData
   * Tidak set Content-Type agar browser set multipart/form-data otomatis
   */
  upload: async (endpoint, formData) => {
    const headers = {};
    
    // Tambahkan Authorization header jika ada token
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🚀 API UPLOAD:', `${API_BASE_URL}${endpoint}`, { 
      file: formData.get('file')?.name,
      metadata: formData.get('metadata'),
      headers 
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData, // FormData untuk file upload
    });
    
    console.log('✅ Response:', response.status, response.statusText);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} ${response.json()}`);
    return response.json();
  },
};

// Export client sesuai mode (mock atau real)
const apiClient = USE_MOCK ? mockApiClient : realApiClient;

export default apiClient;
