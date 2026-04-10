import { PIECES, COLORS } from '../logic/chessLogic';

const PIECE_SYMBOLS = {
  [PIECES.KING]: '♚',
  [PIECES.QUEEN]: '♛',
  [PIECES.ROOK]: '♜',
  [PIECES.BISHOP]: '♝',
  [PIECES.KNIGHT]: '♞',
  [PIECES.PAWN]: '♟'
};

export default function Piece({ type, color }) {
  const isWhite = color === COLORS.WHITE;
  
  // We use solid unicode characters and style their color.
  // We can add a drop shadow for depth.
  return (
    <div 
      className={`
        flex items-center justify-center w-full h-full text-5xl cursor-grab active:cursor-grabbing select-none 
        hover:scale-110 transition-transform duration-200
        ${isWhite ? 'text-slate-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-slate-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.4)]'}
      `}
      style={isWhite ? { WebkitTextStroke: '1px #334155' } : { WebkitTextStroke: '1px #cbd5e1' }}
    >
      {PIECE_SYMBOLS[type]}
    </div>
  );
}
