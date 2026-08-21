import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { authService } from '../services/authService';
import styles from './LobbyPage.module.css';

const LobbyPage = () => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve active user or guest session info
  const user = authService.getCurrentUser();
  const guestData = JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');
  
  const playerId = user ? `user_${user.username}` : (guestData.id || 'guest_anon');
  const playerName = user ? user.username : (guestData.name || 'Player');

  useEffect(() => {
    if (!user && !guestData.name) {
      navigate('/guest');
    }
  }, [user, guestData.name, navigate]);

  const handleCreateRoom = async () => {
    setError('');
    setLoading(true);
    try {
      const room = await roomService.createRoom(playerId, playerName);
      navigate(`/game/${room.roomCode}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to create room.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');

    const cleanCode = roomCodeInput.trim().toUpperCase();
    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter a valid 6-character room code.');
      return;
    }

    setLoading(true);

    try {
      await roomService.joinRoom(cleanCode, playerId, playerName);
      navigate(`/game/${cleanCode}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to join room.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.lobbyContainer}`}>
      <header className={styles.lobbyHeader}>
        <h1>Online Game Lobby</h1>
        <p>Welcome, <span className={styles.playerName}>{playerName}</span>! Choose how you want to play online.</p>
      </header>

      {error && <div className={styles.errorMsg} style={{ marginBottom: '24px' }}>{error}</div>}

      <div className={styles.lobbyGrid}>
        {/* Create Room Card */}
        <div className={styles.lobbyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>🎮</div>
            <h2>Create Private Room</h2>
          </div>
          <p>Generate a unique room code and share it with your friend to play online.</p>
          <button onClick={handleCreateRoom} className={styles.createBtn} disabled={loading}>
            {loading ? 'Creating...' : '+ Create New Room'}
          </button>
        </div>

        {/* Join Room Card */}
        <div className={styles.lobbyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>🔑</div>
            <h2>Join Existing Game</h2>
          </div>
          <p>Enter the 6-character room code shared by your friend to join their game.</p>
          
          <form onSubmit={handleJoinRoom} className={styles.joinForm}>
            <input
              type="text"
              placeholder="e.g. X7K9P2"
              maxLength={6}
              value={roomCodeInput}
              onChange={(e) => {
                setRoomCodeInput(e.target.value);
                setError('');
              }}
              className={styles.codeInput}
            />
            <button type="submit" className={styles.joinBtn} disabled={loading}>
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
