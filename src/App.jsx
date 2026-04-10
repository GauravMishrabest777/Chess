import { useState, useEffect } from 'react';
import Board from './components/Board';
import { getInitialBoard, COLORS, getValidMoves, isCheck, hasValidMoves } from './logic/chessLogic';

function App() {
  const [board, setBoard] = useState(getInitialBoard());
  const [turn, setTurn] = useState(COLORS.WHITE);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  
  // Game states
  const [kingInCheck, setKingInCheck] = useState(null); // 'w' or 'b' or null
  const [gameOver, setGameOver] = useState({ isOver: false, reason: '' });

  // Evaluate game state on every turn change
  useEffect(() => {
    const isCurrentlyCheck = isCheck(board, turn);
    const hasMoves = hasValidMoves(board, turn);
    
    if (isCurrentlyCheck) {
      setKingInCheck(turn);
      if (!hasMoves) {
        setGameOver({ isOver: true, reason: `Checkmate! ${turn === COLORS.WHITE ? 'Black' : 'White'} wins.` });
      }
    } else {
      setKingInCheck(null);
      if (!hasMoves) {
        setGameOver({ isOver: true, reason: 'Stalemate! It\'s a draw.' });
      }
    }
  }, [board, turn]);

  const handleSquareClick = (r, c) => {
    if (gameOver.isOver) return;

    // If we have a piece selected, check if we're clicking a valid move
    if (selectedSquare) {
      const isMoveValid = validMoves.some(([mr, mc]) => mr === r && mc === c);
      
      if (isMoveValid) {
        // Execute move
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[selectedSquare[0]][selectedSquare[1]];
        newBoard[r][c] = piece;
        newBoard[selectedSquare[0]][selectedSquare[1]] = null;
        
        // Auto-promote pawns moving to last rank to Queens for simplicity
        if (piece.type === 'p') {
          if ((piece.color === COLORS.WHITE && r === 0) || (piece.color === COLORS.BLACK && r === 7)) {
            newBoard[r][c] = { type: 'q', color: piece.color };
          }
        }

        setBoard(newBoard);
        setTurn(turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
      
      // If clicking on same square, deselect
      if (selectedSquare[0] === r && selectedSquare[1] === c) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }

    // Try to select a piece
    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelectedSquare([r, c]);
      setValidMoves(getValidMoves(board, r, c));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const restartGame = () => {
    setBoard(getInitialBoard());
    setTurn(COLORS.WHITE);
    setSelectedSquare(null);
    setValidMoves([]);
    setKingInCheck(null);
    setGameOver({ isOver: false, reason: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen font-sans">
      
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-md mb-2">
          React Chess
        </h1>
        <p className="text-slate-400 text-lg">
          {(!gameOver.isOver) ? (
             <span>
               Turn: <strong className={turn === COLORS.WHITE ? 'text-white' : 'text-slate-900 bg-white/80 px-2 py-0.5 rounded'}>
                 {turn === COLORS.WHITE ? 'White' : 'Black'}
               </strong>
             </span>
          ) : (
            <span className="text-emerald-400 font-bold">{gameOver.reason}</span>
          )}
        </p>
      </div>

      <Board 
        board={board} 
        onSquareClick={handleSquareClick}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        kingInCheck={kingInCheck}
      />

      {gameOver.isOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl text-center border border-amber-500/30">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-6 drop-shadow-lg">
              Game Over!
            </h2>
            <p className="text-2xl text-slate-200 mb-8 font-semibold">{gameOver.reason}</p>
            <button 
              onClick={restartGame}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-xl text-white font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-200 active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button 
          onClick={restartGame}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-lg hover:shadow-emerald-500/50 transition-all duration-200 active:scale-95"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;
