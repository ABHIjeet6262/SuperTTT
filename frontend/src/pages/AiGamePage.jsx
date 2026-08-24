import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainBoard from '../components/game/MainBoard';
import TurnIndicator from '../components/game/TurnIndicator';
import GameResultOverlay from '../components/game/GameResultOverlay';
import { createInitialGameState, processMove } from '../utils/superTicTacToeEngine';
import { calculateAiMove } from '../utils/aiBotEngine';
import { soundService } from '../services/soundService';
import styles from './AiGamePage.module.css';

const AiGamePage = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(createInitialGameState());
  const [difficulty, setDifficulty] = useState('SMART'); // 'EASY' or 'SMART'
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerName, setPlayerName] = useState('You');
  const aiTimeoutRef = useRef(null);

  // Sound triggers on state changes
  const prevGameStateRef = useRef(gameState);

  useEffect(() => {
    const prev = prevGameStateRef.current;
    if (gameState.status === 'FINISHED' && prev.status !== 'FINISHED') {
      soundService.playGameWin();
    } else if (gameState.lastMove && (!prev.lastMove || prev.lastMove.cellIndex !== gameState.lastMove.cellIndex || prev.lastMove.boardIndex !== gameState.lastMove.boardIndex)) {
      // Check if a small board was claimed
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

  // AI Turn Handler
  useEffect(() => {
    if (gameState.status === 'PLAYING' && gameState.currentPlayer === 'O') {
      setIsAiThinking(true);
      const delay = difficulty === 'SMART' ? 600 : 400;

      aiTimeoutRef.current = setTimeout(() => {
        const move = calculateAiMove(gameState, difficulty);
        if (move) {
          const result = processMove(gameState, move.boardIndex, move.cellIndex);
          if (result.success) {
            setGameState(result.newState);
          }
        }
        setIsAiThinking(false);
      }, delay);
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [gameState, difficulty]);

  // Player Move Handler
  const handleCellClick = (boardIndex, cellIndex) => {
    if (gameState.currentPlayer !== 'X' || isAiThinking || gameState.status !== 'PLAYING') {
      return;
    }

    const result = processMove(gameState, boardIndex, cellIndex);
    if (result.success) {
      setGameState(result.newState);
    }
  };

  const handleResetGame = () => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setIsAiThinking(false);
    setGameState(createInitialGameState());
  };

  return (
    <div className={`container ${styles.gamePageContainer}`}>
      {/* Header with Difficulty Selection and Reset */}
      <div className={styles.headerBar}>
        <div className={styles.difficultyGroup}>
          <span className={styles.diffLabel}>Bot Level:</span>
          <button 
            onClick={() => setDifficulty('EASY')} 
            className={`${styles.diffBtn} ${difficulty === 'EASY' ? styles.activeDiff : ''}`}
          >
            Casual
          </button>
          <button 
            onClick={() => setDifficulty('SMART')} 
            className={`${styles.diffBtn} ${difficulty === 'SMART' ? styles.activeDiff : ''}`}
          >
            Tactical AI
          </button>
        </div>

        <button onClick={handleResetGame} className={styles.resetBtn}>
          Reset
        </button>
      </div>

      {/* AI Thinking Status Banner */}
      {isAiThinking && (
        <div className={styles.aiThinkingBanner}>
          <span className={styles.botIcon}>🤖</span>
          <span>AI is calculating move...</span>
        </div>
      )}

      {/* Turn Indicator */}
      <TurnIndicator
        playerXName={`${playerName} (You)`}
        playerOName={`AI Bot (${difficulty === 'SMART' ? 'Tactical' : 'Casual'})`}
        currentPlayer={gameState.currentPlayer}
        activeBoard={gameState.activeBoard}
        lastMove={gameState.lastMove}
      />

      {/* Main 9x9 Board */}
      <MainBoard
        gameState={gameState}
        onCellClick={handleCellClick}
      />

      {/* Result Overlay */}
      {gameState.status === 'FINISHED' && (
        <GameResultOverlay
          winner={gameState.winner}
          playerXName={`${playerName} (You)`}
          playerOName="AI Bot"
          onRematch={handleResetGame}
        />
      )}
    </div>
  );
};

export default AiGamePage;
