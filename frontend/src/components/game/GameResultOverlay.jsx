import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GameResultOverlay.module.css';

const GameResultOverlay = ({ winner, playerXName, playerOName, onRematch }) => {
  const navigate = useNavigate();

  const isDraw = winner === 'DRAW';
  const winnerName = winner === 'X' ? playerXName : winner === 'O' ? playerOName : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.icon}>
          {isDraw ? '🤝' : '🏆'}
        </div>

        {isDraw ? (
          <>
            <h1 className={styles.title}>GAME DRAW!</h1>
            <p className={styles.message}>Both players fought to a total stalemate.</p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              PLAYER <span className={winner === 'X' ? styles.xText : styles.oText}>{winner}</span> WINS!
            </h1>
            <p className={styles.message}>Congratulations, <strong>{winnerName}</strong>!</p>
          </>
        )}

        <div className={styles.actionButtons}>
          <button onClick={onRematch} className={styles.rematchBtn}>
            🔄 Play Again
          </button>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultOverlay;
