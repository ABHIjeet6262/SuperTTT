import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LobbyPage.module.css';

const LobbyPage = () => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve active guest or user session info
  const guestData = JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');
  const token = localStorage.getItem('superttt_token');
  const playerName = guestData.name || 'Player';

  useEffect(() => {
    // If user has not set a guest name and is not logged in, force setup
    if (!guestData.name && !token) {
      navigate('/guest');
    }
  }, [guestData.name, token, navigate]);

  const handleCreateRoom = () => {
    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/game/${code}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const cleanCode = roomCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a 6-character room code.');
      return;
    }
    if (cleanCode.length !== 6) {
      setError('Room codes must be exactly 6 characters.');
      return;
    }
    navigate(`/game/${cleanCode}`);
  };

  return (
    <div className={`container ${styles.lobbyContainer}`}>
      <header className={styles.lobbyHeader}>
        <h1>Game Lobby</h1>
        <p>Welcome, <span className={styles.playerName}>{playerName}</span>! Choose how you want to play.</p>
      </header>

      <div className={styles.lobbyGrid}>
        {/* Create Room Card */}
        <div className={styles.lobbyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>🎮</div>
            <h2>Create Private Room</h2>
          </div>
          <p>Generate a unique room code and share it with your friend to play online.</p>
          <button onClick={handleCreateRoom} className={styles.createBtn}>
            + Create New Room
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
            {error && <div className={styles.errorMsg}>{error}</div>}
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
            <button type="submit" className={styles.joinBtn}>
              Join Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
