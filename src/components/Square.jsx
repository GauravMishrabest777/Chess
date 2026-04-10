export default function Square({ 
  piece, 
  isLight, 
  isSelected, 
  isValidMove, 
  isCheckSquare, // King's square when in check
  onClick 
}) {
  
  const baseColor = isLight ? 'square-wood-light' : 'square-wood-dark';
  const selectedClass = isSelected ? 'bg-yellow-400/70' : '';
  const checkClass = isCheckSquare ? 'bg-red-500/80' : '';
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full h-full flex items-center justify-center
        ${baseColor}
      `}
    >
      {/* Background Overlays for states */}
      {(isSelected || isCheckSquare) && (
        <div className={`absolute inset-0 ${selectedClass} ${checkClass} z-0`} />
      )}
      
      {/* Move Hint Indicator */}
      {isValidMove && !piece && (
        <div className="absolute z-10 w-4 h-4 bg-black/20 rounded-full" />
      )}
      {isValidMove && piece && (
        <div className="absolute inset-0 z-10 border-4 border-black/20 rounded-full scale-90" />
      )}

      {/* Piece Render */}
      <div className="relative z-20 w-full h-full">
        {piece}
      </div>
    </div>
  );
}
