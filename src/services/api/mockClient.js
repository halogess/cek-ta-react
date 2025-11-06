/**
 * Mock API Client - Simulasi backend API untuk development
 * Menggunakan backend controllers untuk semua logika bisnis
 * 
 * Digunakan saat VITE_USE_MOCK=true
 */

import { 
  validationController, 
  dashboardController, 
  templateController, 
  authController, 
  settingsController, 
  userController 
} from '../../backend';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockApiClient = {
  get: async (endpoint, options = {}) => {
    console.log('🔵 Mock GET:', endpoint, options.params);
    await delay();
    
    if (endpoint === '/validations/books') {
      return validationController.getAllBookValidations(options.params);
    }
    
    if (endpoint.startsWith('/validations/books/user/')) {
      const pathParts = endpoint.split('/');
      const userId = pathParts[4];
      
      if (pathParts[5] === 'judul') {
        return validationController.getJudulBukuByUser(userId);
      }
      
      return validationController.getBookValidationsByUser(userId, options.params);
    }
    
    if (endpoint.startsWith('/validations/user/')) {
      const userId = endpoint.split('/').pop();
      return validationController.getValidationsByUser(userId, options.params);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/certificate')) {
      if (options.responseType === 'blob') {
        return validationController.downloadCertificate(parseInt(endpoint.split('/')[2]));
      }
      return { url: '/certificate.pdf' };
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/errors')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getValidationErrors(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/structure')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getDocumentStructure(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/recommendations')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getRecommendations(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/preview')) {
      const pathParts = endpoint.split('/');
      const id = parseInt(pathParts[2]);
      const errorIndex = parseInt(pathParts[4]) || 0;
      return validationController.getDocumentPreview(id, errorIndex);
    }
    
    if (endpoint.startsWith('/validations/')) {
      const id = endpoint.split('/')[2];
      return validationController.getValidationById(parseInt(id));
    }
    
    if (endpoint.startsWith('/validations')) {
      return validationController.getAllValidations(options.params);
    }
    
    if (endpoint.startsWith('/users/nrp/')) {
      const nrp = endpoint.split('/').pop();
      return userController.getUserByNrp(nrp);
    }
    
    if (endpoint === '/settings/min-score') {
      return settingsController.getMinScore();
    }
    
    if (endpoint === '/templates/active') {
      return templateController.getActiveTemplate();
    }
    
    if (endpoint === '/templates') {
      return templateController.getAllTemplates();
    }
    
    if (endpoint.startsWith('/templates/') && endpoint.includes('/download')) {
      if (options.responseType === 'blob') {
        return templateController.downloadTemplate(parseInt(endpoint.split('/')[2]));
      }
      return { url: '/template.docx' };
    }
    
    if (endpoint === '/dashboard/admin/stats') {
      return dashboardController.getAdminStats();
    }
    
    if (endpoint.startsWith('/dashboard/mahasiswa/')) {
      const pathParts = endpoint.split('/');
      const userId = pathParts[3];
      
      if (pathParts.length === 4 || (pathParts.length === 5 && pathParts[4] === '')) {
        return dashboardController.getMahasiswaDashboard(userId);
      }
    }
    
    if (endpoint === '/dashboard/admin/error-stats') {
      return dashboardController.getErrorStatistics();
    }
    
    if (endpoint === '/dashboard/admin/system-info') {
      return dashboardController.getSystemInfo();
    }
    
    if (endpoint.startsWith('/users/')) {
      const userId = endpoint.split('/').pop();
      return userController.getUserByNrp(userId);
    }
    
    throw new Error('Endpoint not found');
  },

  post: async (endpoint, data) => {
    console.log('🔵 Mock POST:', endpoint, data);
    await delay();
    
    if (endpoint === '/auth/login') {
      const { username, password } = data;
      return authController.login(username, password);
    }
    
    if (endpoint === '/auth/logout') {
      return authController.logout();
    }
    
    throw new Error('Endpoint not found');
  },

  put: async (endpoint, data) => {
    console.log('🔵 Mock PUT:', endpoint, data);
    await delay();
    
    if (endpoint.includes('/cancel')) {
      return validationController.cancelValidation(parseInt(endpoint.split('/')[2]));
    }
    
    if (endpoint === '/settings/min-score') {
      return settingsController.updateMinScore(data.score);
    }
    
    if (endpoint.includes('/activate')) {
      return templateController.activateTemplate(parseInt(endpoint.split('/')[2]));
    }
    
    if (endpoint.includes('/rules')) {
      return templateController.updateRules(parseInt(endpoint.split('/')[2]), data);
    }
    
    if (endpoint.startsWith('/templates/')) {
      return templateController.updateTemplate(parseInt(endpoint.split('/')[2]), data);
    }
    
    throw new Error('Endpoint not found');
  },

  delete: async (endpoint) => {
    console.log('🔵 Mock DELETE:', endpoint);
    await delay();
    return templateController.deleteTemplate(parseInt(endpoint.split('/')[2]));
  },

  upload: async (endpoint, formData) => {
    console.log('🔵 Mock UPLOAD:', endpoint, {
      file: formData.get('file')?.name,
      metadata: formData.get('metadata'),
    });
    await delay(1000);
    
    if (endpoint === '/validations/upload') {
      return validationController.uploadDocument(formData.get('file'), JSON.parse(formData.get('metadata')));
    }
    
    if (endpoint === '/validations/upload-book') {
      return validationController.uploadBook(formData.getAll('files'), JSON.parse(formData.get('metadata')));
    }
    
    if (endpoint === '/templates/upload') {
      return templateController.uploadTemplate(formData);
    }
    
    throw new Error('Endpoint not found');
  },
};

export default mockApiClient;
