import React from 'react';
import { PIECES } from '../constants';

interface CapturedPiecesProps {
  pieces: string[]; // Array of piece types (p, n, b, r, q)
  color: 'w' | 'b'; // The color of the pieces to display (e.g. 'b' for black pieces captured by white)
  score?: number;   // Material advantage score (positive number)
}

const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color, score }) => {
  // Sort pieces by value for display (Pawn -> Queen)
  const sortedPieces = [...pieces].sort((a, b) => PIECE_VALUES[a] - PIECE_VALUES[b]);

  if (pieces.length === 0 && !score) return <div className="h-6"></div>;

  return (
    <div className="flex items-center h-6 gap-2">
      <div className="flex items-center -space-x-1.5">
        {sortedPieces.map((p, idx) => (
          <div key={`${p}-${idx}`} className="w-5 h-5 opacity-90">
             {PIECES[`${color}${p.toUpperCase()}`]}
          </div>
        ))}
      </div>
      {score && score > 0 && (
        <div className="text-xs font-mono font-semibold text-[#a1887f] bg-[#1e140d] px-1.5 py-0.5 rounded border border-[#5c4033]">
          +{score}
        </div>
      )}
    </div>
  );
};