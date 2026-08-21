import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(roomCode, onMessageReceived, onConnected, onError) {
    if (this.stompClient && this.stompClient.active) {
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws/game');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // Console debug logging
      },
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      if (onConnected) onConnected();

      // Subscribe to room topic
      this.stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
        const payload = JSON.parse(message.body);
        if (onMessageReceived) onMessageReceived(payload);
      });
    };

    this.stompClient.onStompError = (frame) => {
      this.connected = false;
      if (onError) onError(frame.headers['message']);
    };

    this.stompClient.activate();
  }

  sendMove(roomCode, playerId, playerName, boardIndex, cellIndex) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/move`,
        body: JSON.stringify({
          type: 'MOVE_MADE',
          roomCode,
          playerId,
          playerName,
          boardIndex,
          cellIndex
        })
      });
    }
  }

  sendReaction(roomCode, playerId, playerName, reaction) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/reaction`,
        body: JSON.stringify({
          type: 'REACTION_SENT',
          roomCode,
          playerId,
          playerName,
          reaction
        })
      });
    }
  }

  sendRematch(roomCode, playerId, playerName) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/game/${roomCode}/rematch`,
        body: JSON.stringify({
          type: 'REMATCH_REQUESTED',
          roomCode,
          playerId,
          playerName
        })
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
