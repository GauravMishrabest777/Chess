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
        ${isPawn ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'}
        ${isWhite ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)]'}
      `}
      style={isWhite ? { WebkitTextStroke: '1.5px #000' } : { WebkitTextStroke: '1px #fff' }}
    >
      {PIECE_SYMBOLS[type]}
    </div>
  );
}
