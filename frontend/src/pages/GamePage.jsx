import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import MainBoard from '../components/game/MainBoard';
import TurnIndicator from '../components/game/TurnIndicator';
import GameResultOverlay from '../components/game/GameResultOverlay';
import ReactionPicker from '../components/game/ReactionPicker';
import websocketService from '../services/websocketService';
import { roomService } from '../services/roomService';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { createInitialGameState } from '../utils/superTicTacToeEngine';
import styles from './GamePage.module.css';

const GamePage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const [guestData, setGuestData] = useState(() => {
    return JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');
  });

  const [promptGuestName, setPromptGuestName] = useState('');
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(createInitialGameState());
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState('');
  const [activeReaction, setActiveReaction] = useState(null);
  const [rematchStatus, setRematchStatus] = useState('');

  const playerId = user ? `user_${user.username}` : (guestData.id || '');
  const playerName = user ? user.username : (guestData.name || '');

  const prevGameStateRef = useRef(gameState);
  const shareUrl = `${window.location.origin}/game/${roomCode}`;

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
    if (!roomCode || !playerId || !playerName) return;

    websocketService.connect(
      roomCode,
      (message) => {
        if (message.gameState) {
          const prev = prevGameStateRef.current;
          const next = message.gameState;

          if (next.status === 'FINISHED' && prev.status !== 'FINISHED') {
            soundService.playGameWin();
          } else if (next.lastMove && (!prev.lastMove || prev.lastMove.cellIndex !== next.lastMove.cellIndex || prev.lastMove.boardIndex !== next.lastMove.boardIndex)) {
            const prevWonCount = prev.boardStatuses.filter(s => s.startsWith('WON')).length;
            const nextWonCount = next.boardStatuses.filter(s => s.startsWith('WON')).length;
            if (nextWonCount > prevWonCount) {
              soundService.playBoardWin();
            } else {
              soundService.playMove();
            }
          }

          prevGameStateRef.current = next;
          setGameState(next);
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
          soundService.playReaction();
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

  // Handle direct link/QR join where player needs a display name
  const handleJoinViaDirectLink = async (e) => {
    e.preventDefault();
    if (!promptGuestName.trim()) return;

    const newGuestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    const guestObj = { id: newGuestId, name: promptGuestName.trim(), isGuest: true };
    sessionStorage.setItem('superttt_guest', JSON.stringify(guestObj));
    setGuestData(guestObj);

    try {
      await roomService.joinRoom(roomCode, newGuestId, promptGuestName.trim());
    } catch (err) {
      // Room might already have opponent or be in playing state
    }
  };

  const handleCellClick = (boardIndex, cellIndex) => {
    setError('');
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
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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

  // If user scanned QR code or joined via direct link without a name, prompt them
  if (!user && !guestData.name) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.waitingCard}>
          <div className={styles.badge}>Join Game Room</div>
          <h2>Enter Room {roomCode}</h2>
          <p>Choose a display name to enter the match:</p>

          <form onSubmit={handleJoinViaDirectLink} className={styles.directJoinForm}>
            <input
              type="text"
              placeholder="Your Name (e.g. Alex)"
              value={promptGuestName}
              onChange={(e) => setPromptGuestName(e.target.value)}
              maxLength={20}
              required
              autoFocus
              className={styles.nameInput}
            />
            <button type="submit" className={styles.primaryJoinBtn}>
              🎮 Join Match Now
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Determine if the game is active (2 players present & playing)
  const isGameActive = 
    (gameState && gameState.status === 'PLAYING' && gameState.playerOId && gameState.playerOId.length > 0) ||
    (room && room.status === 'PLAYING' && room.opponentId);

  // WAITING STATE (Show waiting card with Code & QR Code)
  if (!isGameActive && room && room.status === 'WAITING' && !room.opponentId) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.waitingCard}>
          <div className={styles.badge}>ROOM CREATED</div>
          <h2>Your Room is Ready!</h2>
          <p>Share this code or scan the QR code to join:</p>

          {/* 6-Digit Code Section */}
          <div className={styles.codeBox}>
            <span className={styles.codeText}>{roomCode}</span>
            <button onClick={handleCopyCode} className={styles.copyBtn}>
              {copiedCode ? '✓ Copied!' : '📋 Copy Code'}
            </button>
          </div>

          {/* QR Code Section */}
          <div className={styles.qrSection}>
            <div className={styles.qrCard}>
              <QRCodeSVG
                value={shareUrl}
                size={140}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
                includeMargin={false}
              />
            </div>
            <div className={styles.qrPrompt}>
              <span>📱 Scan with phone to join instantly</span>
              <button onClick={handleCopyLink} className={styles.copyLinkBtn}>
                {copiedLink ? '✓ Link Copied!' : '🔗 Copy Share Link'}
              </button>
            </div>
          </div>

          <div className={styles.pulseBox}>
            <div className={styles.spinner}></div>
            <span>Waiting for opponent to connect...</span>
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

      <ReactionPicker onSendReaction={handleSendReaction} />

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
