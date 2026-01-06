import React, { useState, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { PIECES, BOARD_THEME } from '../constants';

interface BoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  orientation?: 'w' | 'b';
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const Board: React.FC<BoardProps> = ({ game, onMove, orientation = 'w' }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

  // Derived state from game
  const fen = game.fen();
  const checkSquare = game.inCheck() ? (game.turn() === 'w' ? findKing(game, 'w') : findKing(game, 'b')) : null;
  const lastMove = game.history({ verbose: true }).pop();

  function findKing(gameInstance: Chess, color: 'w' | 'b'): Square | null {
    const board = gameInstance.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          return piece.square;
        }
      }
    }
    return null;
  }

  const handleSquareClick = (square: Square) => {
    // If we already selected a square
    if (selectedSquare) {
      // If clicking the same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // Check if the clicked square is a valid move target
      const move = possibleMoves.find((m) => m.to === square);
      
      if (move) {
        onMove({ from: selectedSquare, to: square, promotion: 'q' }); // Auto-queen for simplicity
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        // If not a valid move, check if we are selecting a new piece of our own color
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          setPossibleMoves(game.moves({ square, verbose: true }));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select a piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }));
      }
    }
  };

  const boardRows = orientation === 'w' ? RANKS : [...RANKS].reverse();
  const boardCols = orientation === 'w' ? FILES : [...FILES].reverse();

  return (
    <div className="relative select-none touch-none aspect-square w-full max-w-[80vh] shadow-2xl rounded-sm overflow-hidden border border-[#5c4033]">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {boardRows.map((rank, rankIndex) =>
          boardCols.map((file, fileIndex) => {
            const square = (file + rank) as Square;
            const isDark = (rankIndex + fileIndex) % 2 !== 0;
            const piece = game.get(square);
            
            // Highlight logic
            const isSelected = selectedSquare === square;
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isValidMove = possibleMoves.some(m => m.to === square);
            const isCapture = isValidMove && piece; // capturing if valid move and piece exists
            const isCheck = checkSquare === square;

            let bgClass = isDark ? BOARD_THEME.dark : BOARD_THEME.light;
            
            // Layered backgrounds
            if (isSelected || isLastMoveFrom || isLastMoveTo) {
               bgClass = `${bgClass} ${BOARD_THEME.lastMove}`; // Mixing logic roughly
               // Note: Tailwind doesn't mix well without opacity util classes, so we rely on the rgba in constants or override.
               // For strict Chess.com look,selected is usually a specific yellow highlight.
               if (isSelected) bgClass = `${isDark ? 'bg-[#baca44]' : 'bg-[#f6f669]'}`;
               else if (isLastMoveFrom || isLastMoveTo) bgClass = `${isDark ? 'bg-[#aaa23a]' : 'bg-[#ced26a]'}`;
            }

            if (isCheck) {
               bgClass = `${isDark ? 'bg-red-800' : 'bg-red-400'} radial-gradient(red, transparent)`; // Simplification
               // Let's just use a solid class for check
               bgClass = '!bg-[#ec5d5d]';
            }

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer ${bgClass}`}
              >
                {/* Rank/File Labels */}
                {file === (orientation === 'w' ? 'a' : 'h') && (
                   <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${isDark ? 'text-[#ebecd0]' : 'text-[#739552]'}`}>
                     {rank}
                   </span>
                )}
                {rank === (orientation === 'w' ? '1' : '8') && (
                  <span className={`absolute bottom-0 right-1 text-[10px] font-bold ${isDark ? 'text-[#ebecd0]' : 'text-[#739552]'}`}>
                    {file}
                  </span>
                )}

                {/* Move Hint Indicators */}
                {isValidMove && !isCapture && (
                  <div className="absolute w-3 h-3 bg-black/15 rounded-full z-10 pointer-events-none"></div>
                )}
                {isValidMove && isCapture && (
                  <div className="absolute w-full h-full border-[6px] border-black/10 rounded-full z-10 pointer-events-none"></div>
                )}

                {/* Piece */}
                {piece && (
                  <div className="w-[85%] h-[85%] z-20 pointer-events-none transition-transform duration-150">
                    {PIECES[`${piece.color}${piece.type.toUpperCase()}`]}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};