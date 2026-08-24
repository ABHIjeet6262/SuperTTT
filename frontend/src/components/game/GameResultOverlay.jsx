import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GameResultOverlay.module.css';

const GameResultOverlay = ({
  winner = 'DRAW',
  playerXName = 'Player 1',
  playerOName = 'Player 2',
  onRematch,
}) => {
  const navigate = useNavigate();

  const isDraw = winner === 'DRAW';
  const winnerName = winner === 'X' ? playerXName : playerOName;

  return (
    <div className={styles.overlayBackdrop}>
      <div className={styles.resultCard}>
        <div className={styles.statusBadge}>
          {isDraw ? 'Game Over' : 'Match Won'}
        </div>

        <h1 className={styles.title}>
          {isDraw ? 'Match Drawn' : `${winnerName} Wins`}
        </h1>

        <p className={styles.subtitle}>
          {isDraw 
            ? 'A closely contested match with no overall 3-in-a-row winner.' 
            : `${winnerName} claimed 3 small boards in a row.`}
        </p>

        <div className={styles.actionButtons}>
          <button onClick={onRematch} className={styles.rematchBtn}>
            Play Again
          </button>
          <button onClick={() => navigate('/lobby')} className={styles.lobbyBtn}>
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultOverlay;
