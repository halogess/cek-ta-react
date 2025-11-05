/**
 * Settings Controller - Backend Logic Simulation
 * Semua logika bisnis untuk system settings
 */

let minScore = 80;

export const settingsController = {
  /**
   * Get minimum score
   */
  getMinScore: () => {
    return { score: minScore };
  },

  /**
   * Update minimum score
   */
  updateMinScore: (score) => {
    minScore = score;
    return { score: minScore };
  },
};
