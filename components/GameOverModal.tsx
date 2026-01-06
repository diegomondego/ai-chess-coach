import React from 'react';
import { RotateCcw, BrainCircuit, Menu } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  onNewGame: () => void;
  onAnalyze: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isOpen, 
  winner, 
  reason, 
  onNewGame, 
  onAnalyze,
  onMenu 
}) => {
  if (!isOpen) return null;

  const isWin = winner === 'w';
  const isLoss = winner === 'b';
  const isDraw = winner === 'draw';

  let title = '';
  let subTitle = '';
  let titleColor = '';

  if (isWin) {
    title = 'You Won!';
    subTitle = 'Checkmate';
    titleColor = 'text-[#81b64c]';
  } else if (isLoss) {
    title = 'You Lost';
    subTitle = 'Checkmate';
    titleColor = 'text-[#e0d3c5]';
  } else {
    title = 'Draw';
    subTitle = reason || 'Stalemate';
    titleColor = 'text-[#a1887f]';
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#291b12] border border-[#5c4033] rounded-xl shadow-2xl p-6 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-200">
        
        <div className="text-center">
            <h2 className={`text-4xl font-black mb-2 ${titleColor}`}>{title}</h2>
            <p className="text-[#a1887f] text-lg font-medium uppercase tracking-wide">{subTitle}</p>
        </div>

        <div className="flex flex-col w-full gap-3">
            <button 
                onClick={onAnalyze}
                className="w-full py-3.5 px-4 rounded-lg bg-[#81b64c] hover:bg-[#95c95d] text-[#1e140d] font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
            >
                <BrainCircuit className="w-5 h-5" />
                Start Analysis
            </button>
            
            <button 
                onClick={onNewGame}
                className="w-full py-3.5 px-4 rounded-lg bg-[#e0d3c5] hover:bg-white text-[#3c2a1e] font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
            >
                <RotateCcw className="w-5 h-5" />
                New Game
            </button>
            
            <button 
                onClick={onMenu}
                className="w-full py-3 px-4 rounded-lg text-[#a1887f] hover:text-[#e0d3c5] hover:bg-[#3e2723] font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
            >
                <Menu className="w-5 h-5" />
                Back to Menu
            </button>
        </div>

      </div>
    </div>
  );
};