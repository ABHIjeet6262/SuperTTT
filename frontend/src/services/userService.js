import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  getGameHistory: async () => {
    const response = await api.get('/games/history');
    return response.data;
  }
};
