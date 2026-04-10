export const PIECES = {
  PAWN: 'p',
  ROOK: 'r',
  KNIGHT: 'n',
  BISHOP: 'b',
  QUEEN: 'q',
  KING: 'k'
};

export const COLORS = {
  WHITE: 'w',
  BLACK: 'b'
};

export function getInitialBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  const placeRow = (row, color) => {
    board[row][0] = { type: PIECES.ROOK, color };
    board[row][1] = { type: PIECES.KNIGHT, color };
    board[row][2] = { type: PIECES.BISHOP, color };
    board[row][3] = { type: PIECES.QUEEN, color };
    board[row][4] = { type: PIECES.KING, color };
    board[row][5] = { type: PIECES.BISHOP, color };
    board[row][6] = { type: PIECES.KNIGHT, color };
    board[row][7] = { type: PIECES.ROOK, color };
  };

  placeRow(0, COLORS.BLACK);
  for (let i = 0; i < 8; i++) board[1][i] = { type: PIECES.PAWN, color: COLORS.BLACK };

  placeRow(7, COLORS.WHITE);
  for (let i = 0; i < 8; i++) board[6][i] = { type: PIECES.PAWN, color: COLORS.WHITE };

  return board;
}

// Check if a square is within board bounds
export const isValidSquare = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

// Get valid moves for a piece (without checking for King safety/check yet)
export function getPseudoLegalMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const moves = [];
  const { type, color } = piece;

  const addMove = (targetR, targetC) => {
    if (!isValidSquare(targetR, targetC)) return false;
    const targetPiece = board[targetR][targetC];
    if (targetPiece) {
      if (targetPiece.color !== color) moves.push([targetR, targetC]);
      return false; // blocked further sliding
    }
    moves.push([targetR, targetC]);
    return true; // can continue sliding
  };

  const addSlidingMoves = (directions) => {
    for (const [dr, dc] of directions) {
      let currR = r + dr;
      let currC = c + dc;
      while (isValidSquare(currR, currC)) {
        if (!addMove(currR, currC)) break;
        currR += dr;
        currC += dc;
      }
    }
  };

  const straightDirs = [[-1,0], [1,0], [0,-1], [0,1]];
  const diagDirs = [[-1,-1], [-1,1], [1,-1], [1,1]];

  if (type === PIECES.PAWN) {
    const dir = color === COLORS.WHITE ? -1 : 1;
    const startRow = color === COLORS.WHITE ? 6 : 1;
    // push one step
    if (isValidSquare(r + dir, c) && !board[r + dir][c]) {
      moves.push([r + dir, c]);
      // push two steps
      if (r === startRow && !board[r + dir * 2][c]) {
        moves.push([r + dir * 2, c]);
      }
    }
    // capture
    for (const dc of [-1, 1]) {
      if (isValidSquare(r + dir, c + dc)) {
        const target = board[r + dir][c + dc];
        if (target && target.color !== color) {
          moves.push([r + dir, c + dc]);
        }
      }
    }
  } else if (type === PIECES.ROOK) {
    addSlidingMoves(straightDirs);
  } else if (type === PIECES.BISHOP) {
    addSlidingMoves(diagDirs);
  } else if (type === PIECES.QUEEN) {
    addSlidingMoves([...straightDirs, ...diagDirs]);
  } else if (type === PIECES.KNIGHT) {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    knightMoves.forEach(([dr, dc]) => addMove(r + dr, c + dc));
  } else if (type === PIECES.KING) {
    const kingMoves = [...straightDirs, ...diagDirs];
    kingMoves.forEach(([dr, dc]) => addMove(r + dr, c + dc));
  }

  return moves;
}

// Find king's position
export function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === PIECES.KING && p.color === color) {
        return [r, c];
      }
    }
  }
  return null;
}

// Check if a specific color's king is currently attacked
export function isCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false; // shouldn't happen
  const [kr, kc] = kingPos;
  
  // check all enemy pieces
  const enemyColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === enemyColor) {
        const moves = getPseudoLegalMoves(board, r, c);
        if (moves.some(([mr, mc]) => mr === kr && mc === kc)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Get purely strict valid moves, eliminating those that leave king in check
export function getValidMoves(board, r, c) {
  const pseudoMoves = getPseudoLegalMoves(board, r, c);
  const piece = board[r][c];
  if (!piece) return [];
  
  const validMoves = [];
  // simulate each move and see if it leaves the king in check
  for (const [mr, mc] of pseudoMoves) {
    // deep clone board loosely
    const tempBoard = board.map(row => [...row]);
    
    // apply move
    tempBoard[mr][mc] = piece;
    tempBoard[r][c] = null;
    
    // if not in check, it's valid
    if (!isCheck(tempBoard, piece.color)) {
      validMoves.push([mr, mc]);
    }
  }
  return validMoves;
}

// Check if a player has any valid moves left (Checkmate or Stalemate)
export function hasValidMoves(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        const moves = getValidMoves(board, r, c);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}
