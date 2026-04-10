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
    board[row][0] = { type: PIECES.ROOK, color, hasMoved: false };
    board[row][1] = { type: PIECES.KNIGHT, color, hasMoved: false };
    board[row][2] = { type: PIECES.BISHOP, color, hasMoved: false };
    board[row][3] = { type: PIECES.QUEEN, color, hasMoved: false };
    board[row][4] = { type: PIECES.KING, color, hasMoved: false };
    board[row][5] = { type: PIECES.BISHOP, color, hasMoved: false };
    board[row][6] = { type: PIECES.KNIGHT, color, hasMoved: false };
    board[row][7] = { type: PIECES.ROOK, color, hasMoved: false };
  };

  placeRow(0, COLORS.BLACK);
  for (let i = 0; i < 8; i++) board[1][i] = { type: PIECES.PAWN, color: COLORS.BLACK, hasMoved: false };

  placeRow(7, COLORS.WHITE);
  for (let i = 0; i < 8; i++) board[6][i] = { type: PIECES.PAWN, color: COLORS.WHITE, hasMoved: false };

  return board;
}

export const isValidSquare = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

export function isSquareUnderAttack(board, r, c, attackingColor) {
  for (let ir = 0; ir < 8; ir++) {
    for (let ic = 0; ic < 8; ic++) {
      const p = board[ir][ic];
      if (p && p.color === attackingColor) {
        // we pass checkCastling=false to avoid infinite recursion
        const moves = getPseudoLegalMoves(board, ir, ic, false);
        if (moves.some(([mr, mc]) => mr === r && mc === c)) {
          return true;
        }
      }
    }
  }
  return false;
}

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

export function isCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const enemyColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  return isSquareUnderAttack(board, kingPos[0], kingPos[1], enemyColor);
}

// checkCastling helps prevent infinite loop when looking for threats
export function getPseudoLegalMoves(board, r, c, checkCastling = true) {
  const piece = board[r][c];
  if (!piece) return [];
  const moves = [];
  const { type, color } = piece;

  const addMove = (targetR, targetC) => {
    if (!isValidSquare(targetR, targetC)) return false;
    const targetPiece = board[targetR][targetC];
    if (targetPiece) {
      if (targetPiece.color !== color) moves.push([targetR, targetC]);
      return false; 
    }
    moves.push([targetR, targetC]);
    return true; 
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
    // push
    if (isValidSquare(r + dir, c) && !board[r + dir][c]) {
      moves.push([r + dir, c]);
      // double push
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

    // Castling logic!
    if (checkCastling && !piece.hasMoved && !isCheck(board, color)) {
      const enemyColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
      
      // Kingside castling
      const rightRook = board[r][7];
      if (rightRook && rightRook.type === PIECES.ROOK && !rightRook.hasMoved) {
        if (!board[r][5] && !board[r][6]) {
          // ensure squares aren't attacked
          if (!isSquareUnderAttack(board, r, 5, enemyColor) && !isSquareUnderAttack(board, r, 6, enemyColor)) {
            moves.push([r, 6]);
          }
        }
      }
      
      // Queenside castling
      const leftRook = board[r][0];
      if (leftRook && leftRook.type === PIECES.ROOK && !leftRook.hasMoved) {
        if (!board[r][1] && !board[r][2] && !board[r][3]) {
          if (!isSquareUnderAttack(board, r, 2, enemyColor) && !isSquareUnderAttack(board, r, 3, enemyColor)) {
            moves.push([r, 2]);
          }
        }
      }
    }
  }

  return moves;
}

export function getValidMoves(board, r, c) {
  const pseudoMoves = getPseudoLegalMoves(board, r, c, true);
  const piece = board[r][c];
  if (!piece) return [];
  
  const validMoves = [];
  for (const [mr, mc] of pseudoMoves) {
    const tempBoard = board.map(row => [...row]);
    
    // castling pseudo-validation is already handled, but we apply move anyway
    tempBoard[mr][mc] = piece;
    tempBoard[r][c] = null;
    
    // Check if king is safe AFTER move
    // (Note: castling legality requires intermediate squares to be safe too, which we handled in getPseudoLegalMoves)
    if (!isCheck(tempBoard, piece.color)) {
      validMoves.push([mr, mc]);
    }
  }
  return validMoves;
}

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
