import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GamePage.module.css';

const GamePage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.gamePageContainer}`}>
      <div className={styles.topBar}>
        <button onClick={() => navigate('/lobby')} className={styles.backBtn}>
          ← Back to Lobby
        </button>
        <div className={styles.roomBadge}>
          ROOM CODE: <span className={styles.codeText}>{roomCode}</span>
        </div>
      </div>

      <div className={styles.placeholderBox}>
        <div className={styles.icon}>🎯</div>
        <h2>Super Tic-Tac-Toe Arena</h2>
        <p>Room Code: <strong>{roomCode}</strong></p>
        <p className={styles.subtext}>
          The interactive 9×9 Game Board component and real-time WebSocket connection will be connected in Phase 5 & 7!
        </p>
      </div>
    </div>
  );
};

export default GamePage;
