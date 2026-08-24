import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainBoard from '../components/game/MainBoard';
import TurnIndicator from '../components/game/TurnIndicator';
import GameResultOverlay from '../components/game/GameResultOverlay';
import { 
  createInitialGameState, 
  handleLocalMove 
} from '../utils/superTicTacToeEngine';
import styles from './LocalGamePage.module.css';

const LocalGamePage = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(createInitialGameState());
  const [playerXName, setPlayerXName] = useState('Player X');
  const [playerOName, setPlayerOName] = useState('Player O');
  const [isEditingNames, setIsEditingNames] = useState(false);

  const handleCellClick = (boardIndex, cellIndex) => {
    const updatedState = handleLocalMove(gameState, boardIndex, cellIndex);
    setGameState(updatedState);
  };

  const handleResetGame = () => {
    setGameState(createInitialGameState());
  };

  return (
    <div className={`container ${styles.gamePageContainer}`}>
      {/* Header Bar with Names and Reset */}
      <div className={styles.headerBar}>
        <div className={styles.modeTag}>Pass & Play Mode</div>
        <div className={styles.headerActions}>
          <button 
            onClick={() => setIsEditingNames(!isEditingNames)} 
            className={styles.secondaryBtn}
          >
            {isEditingNames ? 'Done Editing' : 'Edit Names'}
          </button>
          <button onClick={handleResetGame} className={styles.secondaryBtn}>
            Reset Board
          </button>
        </div>
      </div>

      {/* Name Customization Drawer */}
      {isEditingNames && (
        <div className={styles.nameEditCard}>
          <div className={styles.nameField}>
            <label>Player X Name</label>
            <input 
              type="text" 
              value={playerXName} 
              onChange={(e) => setPlayerXName(e.target.value || 'Player X')} 
              maxLength={15}
            />
          </div>
          <div className={styles.nameField}>
            <label>Player O Name</label>
            <input 
              type="text" 
              value={playerOName} 
              onChange={(e) => setPlayerOName(e.target.value || 'Player O')} 
              maxLength={15}
            />
          </div>
        </div>
      )}

      {/* Turn Indicator */}
      <TurnIndicator
        playerXName={playerXName}
        playerOName={playerOName}
        currentPlayer={gameState.currentPlayer}
        activeBoard={gameState.activeBoard}
        lastMove={gameState.lastMove}
      />

      {/* 9x9 Nested Board */}
      <MainBoard
        gameState={gameState}
        onCellClick={handleCellClick}
      />

      {/* Game Result Overlay */}
      {gameState.status === 'FINISHED' && (
        <GameResultOverlay
          winner={gameState.winner}
          playerXName={playerXName}
          playerOName={playerOName}
          onRematch={handleResetGame}
        />
      )}
    </div>
  );
};

export default LocalGamePage;
