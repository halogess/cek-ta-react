/**
 * Auth Controller - Backend Logic Simulation
 * Semua logika bisnis untuk authentication
 */

export const authController = {
  /**
   * Login - validate credentials dan return token
   */
  login: (username, password) => {
    // Simulasi validasi
    const role = username === 'admin' ? 'admin' : 'mahasiswa';
    
    return {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      token: 'mock-token-' + Date.now(),
      user: { nrp: username, role },
    };
  },

  /**
   * Logout
   */
  logout: () => {
    return { message: 'Logout successful' };
  },
};
