/**
 * Super Tic-Tac-Toe Game Engine Logic
 * 
 * Grid indexing:
 * 9 small boards (0 to 8)
 * Each small board contains 9 cells (0 to 8)
 * 
 * Winning patterns for 3x3 grids:
 * Rows:     [0, 1, 2], [3, 4, 5], [6, 7, 8]
 * Columns:  [0, 3, 6], [1, 4, 7], [2, 5, 8]
 * Diagonals: [0, 4, 8], [2, 4, 6]
 */

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

export const createInitialGameState = () => ({
  boards: Array(9).fill(null).map(() => Array(9).fill('')),
  boardStatuses: Array(9).fill('IN_PROGRESS'), // 'IN_PROGRESS', 'WON_X', 'WON_O', 'DRAW'
  activeBoard: -1, // -1 means any available small board can be chosen (Wildcard)
  currentPlayer: 'X',
  winner: null, // 'X', 'O', 'DRAW', or null
  status: 'PLAYING', // 'PLAYING', 'FINISHED'
  lastMove: null
});

/**
 * Checks if a 3x3 small board has been won or drawn.
 */
export const checkBoardWinner = (board) => {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === 'X' ? 'WON_X' : 'WON_O';
    }
  }

  // Check if board is full (Draw)
  if (board.every(cell => cell !== '')) {
    return 'DRAW';
  }

  return 'IN_PROGRESS';
};

/**
 * Checks if the overall 9x9 game has been won or drawn based on small board statuses.
 */
export const checkOverallWinner = (boardStatuses) => {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    const statusA = boardStatuses[a];
    const statusB = boardStatuses[b];
    const statusC = boardStatuses[c];

    if ((statusA === 'WON_X' || statusA === 'WON_O') &&
        statusA === statusB && statusA === statusC) {
      return statusA === 'WON_X' ? 'X' : 'O';
    }
  }

  // If all small boards are completed and no overall winner
  if (boardStatuses.every(status => status !== 'IN_PROGRESS')) {
    return 'DRAW';
  }

  return null;
};

/**
 * Process a move in Super Tic-Tac-Toe.
 * Enforces active board restrictions, cell availability, and wildcard rules.
 */
export const processMove = (gameState, boardIndex, cellIndex) => {
  const { boards, boardStatuses, activeBoard, currentPlayer, status } = gameState;

  // 1. Check if game is active
  if (status !== 'PLAYING') return { success: false, reason: 'Game has already ended.' };

  // 2. Validate active board restriction
  if (activeBoard !== -1 && activeBoard !== boardIndex) {
    return { success: false, reason: `Must play in Board ${activeBoard + 1}.` };
  }

  // 3. Validate target board is still in progress
  if (boardStatuses[boardIndex] !== 'IN_PROGRESS') {
    return { success: false, reason: 'This small board is already completed.' };
  }

  // 4. Validate selected cell is empty
  if (boards[boardIndex][cellIndex] !== '') {
    return { success: false, reason: 'This cell is already occupied.' };
  }

  // --- EXECUTE MOVE ---
  const newBoards = boards.map((b, idx) => 
    idx === boardIndex ? [...b] : b
  );
  newBoards[boardIndex][cellIndex] = currentPlayer;

  // Check if this move completes the small board
  const newBoardStatuses = [...boardStatuses];
  const boardResult = checkBoardWinner(newBoards[boardIndex]);
  newBoardStatuses[boardIndex] = boardResult;

  // Check if overall game is won or drawn
  const overallWinner = checkOverallWinner(newBoardStatuses);
  const newGameStatus = overallWinner ? 'FINISHED' : 'PLAYING';

  // Determine next active board
  const targetNextBoard = cellIndex;
  // WILDCARD RULE: If target board is finished, player can choose ANY active board (-1)
  const nextActiveBoard = (newBoardStatuses[targetNextBoard] === 'IN_PROGRESS') 
    ? targetNextBoard 
    : -1;

  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

  return {
    success: true,
    newState: {
      boards: newBoards,
      boardStatuses: newBoardStatuses,
      activeBoard: newGameStatus === 'FINISHED' ? -1 : nextActiveBoard,
      currentPlayer: nextPlayer,
      winner: overallWinner,
      status: newGameStatus,
      lastMove: {
        player: currentPlayer,
        boardIndex,
        cellIndex
      }
    }
  };
};

/**
 * Convenience helper for local pass-and-play move execution
 */
export const handleLocalMove = (gameState, boardIndex, cellIndex) => {
  const result = processMove(gameState, boardIndex, cellIndex);
  return result.success ? result.newState : gameState;
};
