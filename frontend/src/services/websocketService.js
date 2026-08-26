import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const WS_ENDPOINT = `${BACKEND_URL}/ws/game`;

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(roomCode, onMessageReceived, onConnected, onError) {
    if (this.stompClient && this.stompClient.active) {
      if (onConnected) onConnected();
      return;
    }

    // Attach JWT to STOMP CONNECT frame so the server-side WebSocketAuthInterceptor
    // can validate the token and bind the authenticated Principal to the session.
    // Without this header, all moves are treated as unauthenticated guest sessions.
    const token = localStorage.getItem('superttt_token');
    const connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const socket = new SockJS(WS_ENDPOINT);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders,
      debug: () => {},
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;

      this.stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
        const payload = JSON.parse(message.body);
        if (onMessageReceived) onMessageReceived(payload);
      });

      if (onConnected) onConnected();
    };

    this.stompClient.onStompError = (frame) => {
      this.connected = false;
      if (onError) onError(frame.headers['message']);
    };

    this.stompClient.activate();
  }

  sendJoin(roomCode, playerId, playerName) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/join`,
        body: JSON.stringify({ type: 'PLAYER_JOINED', roomCode, playerId, playerName })
      });
    }
  }

  sendMove(roomCode, playerId, playerName, boardIndex, cellIndex) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/move`,
        body: JSON.stringify({ type: 'MOVE_MADE', roomCode, playerId, playerName, boardIndex, cellIndex })
      });
    }
  }

  sendReaction(roomCode, playerId, playerName, reaction) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/reaction`,
        body: JSON.stringify({ type: 'REACTION_SENT', roomCode, playerId, playerName, reaction })
      });
    }
  }

  sendRematch(roomCode, playerId, playerName) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/rematch`,
        body: JSON.stringify({ type: 'REMATCH_REQUESTED', roomCode, playerId, playerName })
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }
}

export default new WebSocketService();
