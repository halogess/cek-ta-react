/**
 * User Controller - Backend Logic Simulation
 * Semua logika bisnis untuk user data
 */

import { mockUsers } from '../data/mockData';

export const userController = {
  /**
   * Get user by NRP
   */
  getUserByNrp: (nrp) => {
    const user = mockUsers.find(u => u.nrp === nrp);
    return user || { nrp, nama: 'Mahasiswa' };
  },
};
