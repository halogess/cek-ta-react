export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Terjadi kesalahan pada server',
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'Tidak dapat terhubung ke server',
      status: 0,
    };
  } else {
    return {
      message: error.message || 'Terjadi kesalahan',
      status: -1,
    };
  }
};

export const isUnauthorized = (error) => {
  return error.status === 401;
};

export const isForbidden = (error) => {
  return error.status === 403;
};

export const isNotFound = (error) => {
  return error.status === 404;
};
