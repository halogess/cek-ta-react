/**
 * Auth Controller - Backend Logic Simulation
 * Semua logika bisnis untuk authentication
 */

export const authController = {
  /**
   * Login - validate credentials dan return token
   */
  login: (username, password) => {
    const role = username === 'admin' ? 'admin' : 'mahasiswa';
    
    // Save NRP to localStorage for mock validation
    if (role === 'mahasiswa') {
      localStorage.setItem('user_nrp', username);
    }
    
    // Create mock JWT token
    const payload = {
      username: username,
      nama: username === 'admin' ? 'Administrator' : 'Mock User',
      role: role,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(payload)) + '.mock-signature';
    
    return {
      access_token: mockToken,
      refresh_token: 'mock-refresh-token-' + Date.now(),
    };
  },

  /**
   * Logout
   */
  logout: () => {
    return { message: 'Logout successful' };
  },

  /**
   * Refresh Token
   */
  refreshToken: () => {
    return {
      access_token: 'mock-access-token-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now(),
    };
  },
};
