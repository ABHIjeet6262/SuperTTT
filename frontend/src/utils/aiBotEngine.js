import { WINNING_COMBINATIONS, checkBoardWinner, checkOverallWinner } from './superTicTacToeEngine';

/**
 * AI Bot Engine for Super Tic-Tac-Toe
 * Supports 'EASY' (casual random) and 'SMART' (tactical heuristic/minimax) difficulties.
 */

// Get all legal [boardIndex, cellIndex] moves for the current state
export const getLegalMoves = (gameState) => {
  const { boards, boardStatuses, activeBoard, status } = gameState;
  if (status !== 'PLAYING') return [];

  const moves = [];

  // Determine allowed boards
  let targetBoards = [];
  if (activeBoard !== -1 && boardStatuses[activeBoard] === 'IN_PROGRESS') {
    targetBoards = [activeBoard];
  } else {
    // Wildcard: all boards in progress
    targetBoards = boardStatuses
      .map((st, idx) => (st === 'IN_PROGRESS' ? idx : null))
      .filter(idx => idx !== null);
  }

  for (let b of targetBoards) {
    for (let c = 0; c < 9; c++) {
      if (boards[b][c] === '') {
        moves.push({ boardIndex: b, cellIndex: c });
      }
    }
  }

  return moves;
};

// Check if a specific player can win a 3x3 board with move (board, cellIndex, player)
const canWinSmallBoard = (board, cellIndex, player) => {
  const testBoard = [...board];
  testBoard[cellIndex] = player;
  return checkBoardWinner(testBoard) === (player === 'X' ? 'WON_X' : 'WON_O');
};

// Check if claiming a small board wins the overall 9x9 match
const canWinMatchWithBoard = (boardStatuses, boardIndex, player) => {
  const testStatuses = [...boardStatuses];
  testStatuses[boardIndex] = player === 'X' ? 'WON_X' : 'WON_O';
  return checkOverallWinner(testStatuses) === player;
};

/**
 * Main AI decision function
 * Returns { boardIndex, cellIndex }
 */
export const calculateAiMove = (gameState, difficulty = 'SMART') => {
  const legalMoves = getLegalMoves(gameState);
  if (legalMoves.length === 0) return null;

  // 1. EASY Mode: Random legal move
  if (difficulty === 'EASY') {
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }

  // 2. SMART Mode: Tactical Evaluation
  const aiPlayer = gameState.currentPlayer; // typically 'O'
  const opponent = aiPlayer === 'X' ? 'O' : 'X';

  let bestMove = null;
  let bestScore = -Infinity;

  for (let move of legalMoves) {
    const { boardIndex, cellIndex } = move;
    const currentBoard = gameState.boards[boardIndex];
    let score = 0;

    // A. Instant Match Win (Game over in our favor)
    if (canWinSmallBoard(currentBoard, cellIndex, aiPlayer)) {
      if (canWinMatchWithBoard(gameState.boardStatuses, boardIndex, aiPlayer)) {
        return move; // Highest possible priority!
      }
      score += 100; // Winning a small board is very high value
    }

    // B. Block Opponent Small Board Win
    if (canWinSmallBoard(currentBoard, cellIndex, opponent)) {
      score += 80;
    }

    // C. Avoid sending opponent to a finished board (triggering a wildcard for them)
    const nextBoardIndex = cellIndex;
    const nextBoardStatus = gameState.boardStatuses[nextBoardIndex];
    if (nextBoardStatus !== 'IN_PROGRESS') {
      score -= 30; // Giving opponent a wildcard is disadvantageous
    } else {
      // D. Check if target next board is dangerous (opponent is about to win it)
      const nextBoard = gameState.boards[nextBoardIndex];
      let opponentThreatCount = 0;
      for (let [a, b, c] of WINNING_COMBINATIONS) {
        const line = [nextBoard[a], nextBoard[b], nextBoard[c]];
        const opponentCount = line.filter(v => v === opponent).length;
        const emptyCount = line.filter(v => v === '').length;
        if (opponentCount === 2 && emptyCount === 1) {
          opponentThreatCount++;
        }
      }
      if (opponentThreatCount > 0) {
        score -= 25; // Don't send opponent where they have an open win
      }
    }

    // E. Strategic Small Board Cell Value (Center > Corners > Edges)
    if (cellIndex === 4) {
      score += 15; // Center cell
    } else if ([0, 2, 6, 8].includes(cellIndex)) {
      score += 10; // Corner cells
    } else {
      score += 5; // Edge cells
    }

    // F. Main Board Strategic Position (Center board 4 has high value)
    if (boardIndex === 4) {
      score += 12;
    } else if ([0, 2, 6, 8].includes(boardIndex)) {
      score += 8;
    }

    // Add tiny random jitter (0-2) to break ties organically
    score += Math.random() * 2;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove || legalMoves[0];
};
