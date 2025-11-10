/**
 * API Client - HTTP client untuk komunikasi dengan backend
 * Mendukung mode mock (development) dan real API (production)
 * Switchable via environment variable VITE_USE_MOCK
 */

import mockApiClient from './mockClient';

// Konfigurasi dari environment variables
const API_BASE_URL = import.meta.env.VITE_MAIN_SERVICE_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Refresh access token menggunakan refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('❌ No refresh token available');
    throw new Error('No refresh token');
  }

  console.log('🔄 Refreshing access token...');
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${refreshToken}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Token refresh failed:', response.status, errorData);
    throw new Error(errorData.message || 'Token refresh failed');
  }
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  console.log('✅ Token refreshed successfully');
  return data.access_token;
};

/**
 * Wrapper untuk retry request dengan token refresh
 */
const fetchWithTokenRefresh = async (fetchFn) => {
  try {
    return await fetchFn();
  } catch (error) {
    // Only handle 401 for token refresh
    if (error.status === 401) {
      console.warn('⚠️ Access token expired, attempting refresh...');
      try {
        await refreshAccessToken();
        console.log('🔁 Retrying request with new token...');
        return await fetchFn();
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        throw refreshError;
      }
    }
    // For other errors, just throw without logout
    console.error('❌ API Error:', error.status || 'Network', error.message);
    throw error;
  }
};

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
    return fetchWithTokenRefresh(async () => {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      
      if (options.params) {
        Object.keys(options.params).forEach(key => {
          if (options.params[key] !== undefined) {
            url.searchParams.append(key, options.params[key]);
          }
        });
      }
      
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token found:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No access_token in localStorage');
      }
      
      console.log('🚀 GET:', url.toString(), 'Headers:', headers);
      const response = await fetch(url, { method: 'GET', headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ GET Error:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      console.log('✅ GET Success:', response.status);
      return options.responseType === 'blob' ? response.blob() : response.json();
    });
  },

  /**
   * POST request dengan JSON body
   */
  post: async (endpoint, data) => {
    return fetchWithTokenRefresh(async () => {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      console.log('🚀 POST:', `${API_BASE_URL}${endpoint}`, data);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ POST Error:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      console.log('✅ POST Success:', response.status);
      return response.json();
    });
  },

  /**
   * PUT request untuk update data
   */
  put: async (endpoint, data) => {
    return fetchWithTokenRefresh(async () => {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      console.log('🚀 PUT:', `${API_BASE_URL}${endpoint}`, data);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ PUT Error:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      console.log('✅ PUT Success:', response.status);
      return response.json();
    });
  },

  /**
   * DELETE request untuk hapus data
   */
  delete: async (endpoint) => {
    return fetchWithTokenRefresh(async () => {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      console.log('🚀 DELETE:', `${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ DELETE Error:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      console.log('✅ DELETE Success:', response.status);
      return response.json();
    });
  },

  /**
   * PATCH request untuk update partial data
   */
  patch: async (endpoint, data) => {
    return fetchWithTokenRefresh(async () => {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      console.log('🚀 PATCH:', `${API_BASE_URL}${endpoint}`, data);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ PATCH Error:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      console.log('✅ PATCH Success:', response.status);
      return response.json();
    });
  },

  /**
   * Upload file dengan FormData
   * Tidak set Content-Type agar browser set multipart/form-data otomatis
   */
  upload: async (endpoint, formData) => {
    return fetchWithTokenRefresh(async () => {
      const headers = {};
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('🚀 UPLOAD:', url, {
        file: formData.get('file')?.name,
        size: formData.get('file')?.size,
        hasToken: !!token
      });
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ UPLOAD Error:', response.status, errorData);
          const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.data = errorData;
          throw error;
        }
        console.log('✅ UPLOAD Success:', response.status);
        return response.json();
      } catch (fetchError) {
        console.error('❌ UPLOAD Network Error:', {
          message: fetchError.message,
          url: url,
          error: fetchError
        });
        throw fetchError;
      }
    });
  },
};

// Export client sesuai mode (mock atau real)
const apiClient = USE_MOCK ? mockApiClient : realApiClient;

export default apiClient;
