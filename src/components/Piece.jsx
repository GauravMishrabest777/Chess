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
  const isPawn = type === PIECES.PAWN;
  
  // We use solid unicode characters and style their color.
  // We can add a drop shadow for depth and make pawns smaller.
  return (
    <div 
      className={`
        flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing select-none 
        hover:scale-110 transition-transform duration-200
        ${isPawn ? 'text-[2.5rem] md:text-5xl' : 'text-5xl md:text-6xl'}
        ${isWhite ? 'text-slate-100 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]' : 'text-zinc-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]'}
      `}
      style={isWhite ? { WebkitTextStroke: '1.5px #27272a' } : { WebkitTextStroke: '1px #e4e4e7' }}
    >
      {PIECE_SYMBOLS[type]}
    </div>
  );
}
