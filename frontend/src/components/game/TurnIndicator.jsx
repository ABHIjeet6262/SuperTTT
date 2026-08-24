import React from 'react';
import styles from './TurnIndicator.module.css';

const TurnIndicator = ({ playerXName, playerOName, currentPlayer, activeBoard, lastMove }) => {
  const isXTurn = currentPlayer === 'X';
  const currentName = isXTurn ? playerXName : playerOName;

  return (
    <div className={styles.container}>
      {/* Player Header Cards */}
      <div className={styles.playersGrid}>
        <div className={`${styles.playerCard} ${isXTurn ? styles.activePlayerX : ''}`}>
          <span className={styles.symbolX}>X</span>
          <span className={styles.name}>{playerXName}</span>
        </div>

        <div className={styles.vsBadge}>VS</div>

        <div className={`${styles.playerCard} ${!isXTurn ? styles.activePlayerO : ''}`}>
          <span className={styles.symbolO}>O</span>
          <span className={styles.name}>{playerOName}</span>
        </div>
      </div>

      {/* Turn & Target Board Guidance */}
      <div className={styles.guidanceBox}>
        <div className={styles.turnText}>
          Turn: <span className={isXTurn ? styles.highlightX : styles.highlightO}>{currentName} ({currentPlayer})</span>
        </div>

        <div className={styles.activeBoardText}>
          {activeBoard === -1 ? (
            <span className={styles.wildcard}>✨ WILDCARD: Play in ANY available small board!</span>
          ) : (
            <span>📍 Target: Must play in <strong>Board {activeBoard + 1}</strong></span>
          )}
        </div>

        {lastMove && (
          <div className={styles.lastMoveText}>
            Last Move: {lastMove.player} played Board {lastMove.boardIndex + 1}, Cell {lastMove.cellIndex + 1}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurnIndicator;
