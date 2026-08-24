import React, { useState, useEffect, useRef } from 'react';
import MainBoard from '../components/game/MainBoard';
import TurnIndicator from '../components/game/TurnIndicator';
import GameResultOverlay from '../components/game/GameResultOverlay';
import { createInitialGameState, processMove } from '../utils/superTicTacToeEngine';
import { soundService } from '../services/soundService';
import styles from './LocalGamePage.module.css';

const LocalGamePage = () => {
  const [playerXName, setPlayerXName] = useState('Player 1');
  const [playerOName, setPlayerOName] = useState('Player 2');
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [gameState, setGameState] = useState(createInitialGameState());
  const [errorMessage, setErrorMessage] = useState('');

  // Audio effects based on game state progression
  const prevGameStateRef = useRef(gameState);

  useEffect(() => {
    const prev = prevGameStateRef.current;
    if (gameState.status === 'FINISHED' && prev.status !== 'FINISHED') {
      soundService.playGameWin();
    } else if (gameState.lastMove && (!prev.lastMove || prev.lastMove.cellIndex !== gameState.lastMove.cellIndex || prev.lastMove.boardIndex !== gameState.lastMove.boardIndex)) {
      const prevWonCount = prev.boardStatuses.filter(s => s.startsWith('WON')).length;
      const currentWonCount = gameState.boardStatuses.filter(s => s.startsWith('WON')).length;
      if (currentWonCount > prevWonCount) {
        soundService.playBoardWin();
      } else {
        soundService.playMove();
      }
    }
    prevGameStateRef.current = gameState;
  }, [gameState]);

  const handleCellClick = (boardIndex, cellIndex) => {
    setErrorMessage('');
    const result = processMove(gameState, boardIndex, cellIndex);

    if (result.success) {
      setGameState(result.newState);
    } else {
      setErrorMessage(result.reason);
    }
  };

  const handleRestart = () => {
    setGameState(createInitialGameState());
    setErrorMessage('');
  };

  const handleRematchSwap = () => {
    setPlayerXName(playerOName);
    setPlayerOName(playerXName);
    setGameState(createInitialGameState());
    setErrorMessage('');
  };

  if (!isSetupDone) {
    return (
      <div className={styles.setupContainer}>
        <div className={styles.setupCard}>
          <div className={styles.icon}>📱</div>
          <h2>Local Pass & Play</h2>
          <p>Two players take turns on the same device screen.</p>

          <form onSubmit={(e) => { e.preventDefault(); setIsSetupDone(true); }} className={styles.form}>
            <div className={styles.field}>
              <label>Player X Name</label>
              <input
                type="text"
                value={playerXName}
                onChange={(e) => setPlayerXName(e.target.value)}
                placeholder="e.g. Alex"
                maxLength={20}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Player O Name</label>
              <input
                type="text"
                value={playerOName}
                onChange={(e) => setPlayerOName(e.target.value)}
                placeholder="e.g. Rahul"
                maxLength={20}
                required
              />
            </div>

            <button type="submit" className={styles.startBtn}>
              🎮 Start Local Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.gamePageContainer}`}>
      <div className={styles.headerBar}>
        <div className={styles.titleBadge}>📱 Local Pass & Play</div>
        <button onClick={handleRestart} className={styles.resetBtn}>
          🔄 Restart Match
        </button>
      </div>

      <TurnIndicator
        playerXName={playerXName}
        playerOName={playerOName}
        currentPlayer={gameState.currentPlayer}
        activeBoard={gameState.activeBoard}
        lastMove={gameState.lastMove}
      />

      {errorMessage && (
        <div className={styles.errorBanner}>{errorMessage}</div>
      )}

      <MainBoard
        gameState={gameState}
        onCellClick={handleCellClick}
      />

      {gameState.status === 'FINISHED' && (
        <GameResultOverlay
          winner={gameState.winner}
          playerXName={playerXName}
          playerOName={playerOName}
          onRematch={handleRematchSwap}
        />
      )}
    </div>
  );
};

export default LocalGamePage;
