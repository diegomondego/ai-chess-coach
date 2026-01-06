import React, { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Group moves into pairs (White, Black)
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || '',
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#291b12]">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-[#a1887f] uppercase bg-[#1e140d] sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-2 w-12 font-semibold border-b border-[#5c4033]">#</th>
                        <th className="px-2 py-2 font-semibold border-b border-[#5c4033]">You</th>
                        <th className="px-2 py-2 font-semibold border-b border-[#5c4033]">Opponent</th>
                    </tr>
                </thead>
                <tbody>
                {movePairs.map((pair, idx) => (
                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#291b12]' : 'bg-[#3e2723]'}`}>
                        <td className="px-4 py-1.5 text-[#8d6e63] w-12 font-mono">{pair.num}.</td>
                        <td className="px-2 py-1.5 font-medium text-[#e0d3c5] hover:bg-[#5d4037] cursor-pointer rounded-sm transition-colors">{pair.white}</td>
                        <td className="px-2 py-1.5 font-medium text-[#e0d3c5] hover:bg-[#5d4037] cursor-pointer rounded-sm transition-colors">{pair.black}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div ref={bottomRef} />
            {history.length === 0 && (
                <div className="p-8 text-center text-[#8d6e63] text-sm italic">
                    Game start
                </div>
            )}
        </div>
    </div>
  );
};