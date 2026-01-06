import React from 'react';
import { BotPersona } from '../types';
import { BOT_PERSONAS } from '../constants';
import { Swords } from 'lucide-react';
import { Avatar } from './Avatar';

interface BotSelectionProps {
  onSelectBot: (bot: BotPersona) => void;
}

export const BotSelection: React.FC<BotSelectionProps> = ({ onSelectBot }) => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#81b64c] p-2 rounded-lg text-[#302e2b]">
             <Swords className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Play vs Computer</h1>
            <p className="text-[#a1887f]">Choose your opponent level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOT_PERSONAS.map((bot) => (
            <div 
              key={bot.id} 
              onClick={() => onSelectBot(bot)}
              className="bg-[#291b12] border border-[#5c4033] hover:border-[#81b64c] rounded-xl p-5 cursor-pointer transition-all hover:transform hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                 <Avatar 
                    id={bot.id}
                    src={bot.avatarImage}
                    description={bot.visualDescription}
                    fallbackText={bot.name[0]}
                    fallbackColor={bot.avatarColor}
                    className="w-14 h-14 rounded-md text-xl"
                 />
                 <div className="bg-[#1e140d] px-3 py-1 rounded text-[#e0d3c5] font-mono text-sm border border-[#5c4033]">
                    {bot.rating}
                 </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#81b64c] transition-colors">{bot.name}</h3>
              <p className="text-sm text-[#a1887f] leading-snug">{bot.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};