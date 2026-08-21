import React from 'react';
import SmallBoard from './SmallBoard';
import styles from './MainBoard.module.css';

const MainBoard = ({ gameState, onCellClick }) => {
  const { boards, boardStatuses, activeBoard, lastMove } = gameState;

  return (
    <div className={styles.mainBoard}>
      {boards.map((cells, boardIndex) => {
        const isActive = (activeBoard === -1 || activeBoard === boardIndex) && boardStatuses[boardIndex] === 'IN_PROGRESS';
        
        return (
          <SmallBoard
            key={boardIndex}
            boardIndex={boardIndex}
            cells={cells}
            status={boardStatuses[boardIndex]}
            isActive={isActive}
            onCellClick={onCellClick}
            lastMove={lastMove}
          />
        );
      })}
    </div>
  );
};

export default MainBoard;
