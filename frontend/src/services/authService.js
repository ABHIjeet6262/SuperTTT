import api from './api';

export const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('superttt_token', response.data.token);
      localStorage.setItem('superttt_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (usernameOrEmail, password) => {
    const response = await api.post('/auth/login', { usernameOrEmail, password });
    if (response.data.token) {
      localStorage.setItem('superttt_token', response.data.token);
      localStorage.setItem('superttt_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('superttt_token');
    localStorage.removeItem('superttt_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('superttt_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
