import Square from './Square';
import Piece from './Piece';
import { PIECES } from '../logic/chessLogic';

export default function Board({ board, onSquareClick, selectedSquare, validMoves, kingInCheck }) {
  const isMoveValid = (r, c) => {
    return validMoves.some(([mr, mc]) => mr === r && mc === c);
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] border-4 border-slate-800 rounded-lg shadow-2xl overflow-hidden">
      {board.map((row, rCheck) => 
        row.map((pieceObj, cCheck) => {
          const isLight = (rCheck + cCheck) % 2 === 0;
          const isSelected = selectedSquare && selectedSquare[0] === rCheck && selectedSquare[1] === cCheck;
          const isValid = isMoveValid(rCheck, cCheck);
          
          let isCheckSquare = false;
          // check if this is the king that is in check
          if (kingInCheck && pieceObj && pieceObj.type === PIECES.KING && pieceObj.color === kingInCheck) {
            isCheckSquare = true;
          }

          return (
            <Square
              key={`${rCheck}-${cCheck}`}
              isLight={isLight}
              isSelected={isSelected}
              isValidMove={isValid}
              isCheckSquare={isCheckSquare}
              piece={pieceObj ? <Piece type={pieceObj.type} color={pieceObj.color} /> : null}
              onClick={() => onSquareClick(rCheck, cCheck)}
            />
          );
        })
      )}
    </div>
  );
}
