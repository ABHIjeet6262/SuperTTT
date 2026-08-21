import api from './api';

export const roomService = {
  createRoom: async (creatorId, creatorName) => {
    const response = await api.post('/rooms', { creatorId, creatorName });
    return response.data;
  },

  getRoom: async (roomCode) => {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data;
  },

  joinRoom: async (roomCode, opponentId, opponentName) => {
    const response = await api.post(`/rooms/${roomCode}/join`, { opponentId, opponentName });
    return response.data;
  }
};
