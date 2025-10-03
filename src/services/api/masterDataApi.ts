import api from './api';

export const masterDataApi = {
  getLanguages: () => api.get('/api/languages'),
  getTechnicalSkills: () => api.get('/api/technical-skills'),
};