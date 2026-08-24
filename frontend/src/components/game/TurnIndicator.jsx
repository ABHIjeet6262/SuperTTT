import React from 'react';
import styles from './TurnIndicator.module.css';

const TurnIndicator = ({
  playerXName = 'Player 1',
  playerOName = 'Player 2',
  currentPlayer = 'X',
  activeBoard = -1,
  lastMove = null,
}) => {
  const isXTurn = currentPlayer === 'X';
  const isWildcard = activeBoard === -1;

  return (
    <div className={styles.container}>
      {/* Player Cards */}
      <div className={styles.playersRow}>
        <div className={`${styles.playerCard} ${styles.playerX} ${isXTurn ? styles.activeTurn : ''}`}>
          <div className={styles.markBadge}>X</div>
          <div className={styles.name}>{playerXName}</div>
        </div>

        <div className={styles.vsBadge}>vs</div>

        <div className={`${styles.playerCard} ${styles.playerO} {!isXTurn ? styles.activeTurn : ''}`}>
          <div className={styles.markBadge}>O</div>
          <div className={styles.name}>{playerOName}</div>
        </div>
      </div>

      {/* Turn & Board Target Status */}
      <div className={styles.statusBox}>
        <div className={styles.turnText}>
          Turn: <span className={styles.turnPlayer}>{isXTurn ? `${playerXName} (X)` : `${playerOName} (O)`}</span>
        </div>
        
        <div className={styles.boardPrompt}>
          {isWildcard ? (
            <span className={styles.wildcard}>Wildcard: Play in any open board</span>
          ) : (
            <span className={styles.targetBoard}>Target: Board {activeBoard + 1}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnIndicator;
