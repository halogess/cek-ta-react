/**
 * Error Handler - Utility untuk menangani error dari API
 * Menyediakan helper functions untuk cek tipe error
 */

/**
 * Handle API error dan return object dengan message dan status
 * @param {Error} error - Error object dari API call
 * @returns {object} { message, status }
 */
export const handleApiError = (error) => {
  // Error dengan response dari server (4xx, 5xx)
  if (error.response) {
    return {
      message: error.response.data?.message || 'Terjadi kesalahan pada server',
      status: error.response.status,
    };
  } 
  // Error network - request dikirim tapi tidak ada response
  else if (error.request) {
    return {
      message: 'Tidak dapat terhubung ke server',
      status: 0,
    };
  } 
  // Error lainnya (setup request, dll)
  else {
    return {
      message: error.message || 'Terjadi kesalahan',
      status: -1,
    };
  }
};

/**
 * Check apakah error adalah Unauthorized (401)
 * User perlu login ulang
 */
export const isUnauthorized = (error) => {
  return error.status === 401;
};

/**
 * Check apakah error adalah Forbidden (403)
 * User tidak punya akses ke resource
 */
export const isForbidden = (error) => {
  return error.status === 403;
};

/**
 * Check apakah error adalah Not Found (404)
 * Resource tidak ditemukan
 */
export const isNotFound = (error) => {
  return error.status === 404;
};
