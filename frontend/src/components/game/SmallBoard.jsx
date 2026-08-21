import React from 'react';
import Cell from './Cell';
import styles from './SmallBoard.module.css';

const SmallBoard = ({ 
  boardIndex, 
  cells, 
  status, 
  isActive, 
  onCellClick, 
  lastMove 
}) => {
  const isWon = status === 'WON_X' || status === 'WON_O';
  const isDraw = status === 'DRAW';
  const winnerSymbol = status === 'WON_X' ? 'X' : status === 'WON_O' ? 'O' : null;

  return (
    <div className={`${styles.smallBoard} ${isActive ? styles.activeBoard : ''} ${isWon || isDraw ? styles.completedBoard : ''}`}>
      <div className={styles.boardHeader}>
        <span>Board {boardIndex + 1}</span>
      </div>

      <div className={styles.grid}>
        {cells.map((cellValue, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cellValue}
            onClick={() => onCellClick(boardIndex, cellIndex)}
            disabled={!isActive || isWon || isDraw}
            isLastMove={lastMove && lastMove.boardIndex === boardIndex && lastMove.cellIndex === cellIndex}
          />
        ))}
      </div>

      {/* Large Completed Mark Overlay */}
      {isWon && (
        <div className={`${styles.overlay} ${winnerSymbol === 'X' ? styles.overlayX : styles.overlayO}`}>
          {winnerSymbol}
        </div>
      )}

      {isDraw && (
        <div className={`${styles.overlay} ${styles.overlayDraw}`}>
          DRAW
        </div>
      )}
    </div>
  );
};

export default SmallBoard;
