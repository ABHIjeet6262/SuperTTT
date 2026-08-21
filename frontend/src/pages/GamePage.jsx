import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainBoard from '../components/game/MainBoard';
import TurnIndicator from '../components/game/TurnIndicator';
import GameResultOverlay from '../components/game/GameResultOverlay';
import ReactionPicker from '../components/game/ReactionPicker';
import websocketService from '../services/websocketService';
import { roomService } from '../services/roomService';
import { authService } from '../services/authService';
import { createInitialGameState } from '../utils/superTicTacToeEngine';
import styles from './GamePage.module.css';

const GamePage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const guestData = JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');
  
  const playerId = user ? `user_${user.username}` : (guestData.id || 'guest_anon');
  const playerName = user ? user.username : (guestData.name || 'Player');

  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(createInitialGameState());
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [activeReaction, setActiveReaction] = useState(null);
  const [rematchStatus, setRematchStatus] = useState('');

  // 1. Fetch Room details on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await roomService.getRoom(roomCode);
        setRoom(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Room not found or expired.');
      }
    };
    fetchRoom();
  }, [roomCode]);

  // 2. Connect WebSocket & Subscribe
  useEffect(() => {
    if (!roomCode) return;

    websocketService.connect(
      roomCode,
      (message) => {
        // Handle incoming WebSocket messages
        if (message.gameState) {
          setGameState(message.gameState);
        }

        if (message.type === 'PLAYER_JOINED') {
          setRoom(prev => prev ? { 
            ...prev, 
            status: 'PLAYING', 
            opponentId: message.playerId,
            opponentName: message.playerName 
          } : prev);
        }

        if (message.type === 'REACTION_SENT') {
          setActiveReaction({ player: message.playerName, reaction: message.reaction });
          setTimeout(() => setActiveReaction(null), 3000);
        }

        if (message.type === 'REMATCH_REQUESTED') {
          if (message.playerId !== playerId) {
            setRematchStatus(`${message.playerName} wants a rematch! Click Play Again to accept.`);
          } else {
            setRematchStatus('Waiting for opponent to accept rematch...');
          }
        }

        if (message.type === 'GAME_RESTARTED') {
          setRematchStatus('');
        }
      },
      () => {
        // Connected! Notify WebSocket server that player joined room page
        websocketService.sendJoin(roomCode, playerId, playerName);
      },
      (err) => {
        setError('WebSocket Connection Error');
      }
    );

    return () => {
      websocketService.disconnect();
    };
  }, [roomCode, playerId, playerName]);

  const handleCellClick = (boardIndex, cellIndex) => {
    setError('');
    // Send move to backend via WebSocket
    websocketService.sendMove(roomCode, playerId, playerName, boardIndex, cellIndex);
  };

  const handleSendReaction = (emoji) => {
    websocketService.sendReaction(roomCode, playerId, playerName, emoji);
  };

  const handleRematch = () => {
    websocketService.sendRematch(roomCode, playerId, playerName);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.errorCard}>
          <h2>⚠️ Room Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/lobby')} className={styles.actionBtn}>
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  // Determine if the game is active (2 players present & playing)
  const isGameActive = 
    (gameState && gameState.status === 'PLAYING' && gameState.playerOId && gameState.playerOId.length > 0) ||
    (room && room.status === 'PLAYING' && room.opponentId);

  // WAITING STATE (Show waiting card ONLY if opponent has not joined)
  if (!isGameActive && room && room.status === 'WAITING' && !room.opponentId) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.waitingCard}>
          <div className={styles.badge}>ROOM CREATED</div>
          <h2>Your Room is Ready!</h2>
          <p>Share this 6-character room code with your opponent:</p>

          <div className={styles.codeBox}>
            <span className={styles.codeText}>{roomCode}</span>
            <button onClick={handleCopyCode} className={styles.copyBtn}>
              {copied ? '✓ Copied!' : '📋 Copy Code'}
            </button>
          </div>

          <div className={styles.pulseBox}>
            <div className={styles.spinner}></div>
            <span>Waiting for opponent to join...</span>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING / FINISHED STATE
  const playerXName = gameState.playerXName || room?.creatorName || 'Player 1';
  const playerOName = gameState.playerOName || room?.opponentName || 'Player 2';

  return (
    <div className={`container ${styles.gamePageContainer}`}>
      <div className={styles.headerBar}>
        <div className={styles.roomInfo}>ROOM: <strong>{roomCode}</strong></div>
        <button onClick={() => navigate('/lobby')} className={styles.leaveBtn}>
          Leave Room
        </button>
      </div>

      <TurnIndicator
        playerXName={playerXName}
        playerOName={playerOName}
        currentPlayer={gameState.currentPlayer}
        activeBoard={gameState.activeBoard}
        lastMove={gameState.lastMove}
      />

      {activeReaction && (
        <div className={styles.reactionBanner}>
          {activeReaction.player} sent {activeReaction.reaction}
        </div>
      )}

      {rematchStatus && (
        <div className={styles.rematchBanner}>{rematchStatus}</div>
      )}

      <MainBoard
        gameState={gameState}
        onCellClick={handleCellClick}
      />

      <ReactionPicker onSendReaction={handleSendReaction} />

      {gameState.status === 'FINISHED' && (
        <GameResultOverlay
          winner={gameState.winner}
          playerXName={playerXName}
          playerOName={playerOName}
          onRematch={handleRematch}
        />
      )}
    </div>
  );
};

export default GamePage;
