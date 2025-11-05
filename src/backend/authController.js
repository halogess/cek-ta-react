/**
 * Auth Controller - Backend Logic Simulation
 * Semua logika bisnis untuk authentication
 */

export const authController = {
  /**
   * Login - validate credentials dan return token
   */
  login: (nrp, password) => {
    // Simulasi validasi
    const role = nrp === 'admin' ? 'admin' : 'mahasiswa';
    
    return {
      token: 'mock-token-' + Date.now(),
      user: { nrp, role },
    };
  },

  /**
   * Logout
   */
  logout: () => {
    return { message: 'Logout successful' };
  },
};
