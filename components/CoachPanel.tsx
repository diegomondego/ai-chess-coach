import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { analyzePosition, chatWithCoach, analyzeFullGame } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import { BrainCircuit, Send, Sparkles, RefreshCcw } from 'lucide-react';

interface CoachPanelProps {
  game: Chess;
  history: string[];
  analysisTrigger?: number; // timestamp to trigger full analysis
}

export const CoachPanel: React.FC<CoachPanelProps> = ({ game, history, analysisTrigger }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Hello! I am your Grandmaster AI Coach. Make a move, and I can analyze it for you, or ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle triggered full game analysis
  useEffect(() => {
    if (analysisTrigger && analysisTrigger > 0) {
        handleFullAnalysis();
    }
  }, [analysisTrigger]);

  const handleFullAnalysis = async () => {
     setIsLoading(true);
     const id = Date.now().toString();
     setMessages(prev => [...prev, { id, role: 'model', text: 'Preparing full game report...', isThinking: true }]);
     
     const report = await analyzeFullGame(history);

     setMessages(prev => prev.map(m => m.id === id ? { ...m, text: report, isThinking: false } : m));
     setIsLoading(false);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    const lastMove = history.length > 0 ? history[history.length - 1] : null;
    const analysisId = Date.now().toString();
    
    setMessages(prev => [...prev, { id: analysisId, role: 'model', text: 'Analyzing position...', isThinking: true }]);

    const text = await analyzePosition(game.fen(), history, lastMove);
    
    setMessages(prev => prev.map(m => m.id === analysisId ? { ...m, text, isThinking: false } : m));
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: 'Thinking...', isThinking: true }]);

    const response = await chatWithCoach(userMsg.text, game.fen(), history);
    
    setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: response, isThinking: false } : m));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#291b12] text-[#e0d3c5]">
      {/* Header */}
      <div className="p-4 border-b border-[#5c4033] flex items-center gap-2 bg-[#1e140d]">
        <BrainCircuit className="w-6 h-6 text-[#81b64c]" />
        <h2 className="text-lg font-bold text-white">Grandmaster Coach</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#5d4037] text-white rounded-br-none' 
                  : 'bg-[#3e2723] border border-[#5c4033] rounded-bl-none'
              }`}
            >
              {msg.isThinking ? (
                <div className="flex items-center gap-2 text-[#a1887f]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <ReactMarkdown 
                  components={{
                    strong: ({node, ...props}) => <span className="font-bold text-[#81b64c]" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4 list-disc marker:text-[#81b64c]" {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="p-2 flex gap-2 border-t border-[#5c4033] bg-[#1e140d]">
        <button 
          onClick={handleAnalyze}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#4e342e] hover:bg-[#5d4037] transition-colors py-2 rounded-md font-semibold text-sm text-white disabled:opacity-50"
        >
          <BrainCircuit className="w-4 h-4" />
          Full Analysis
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 pt-2 border-t border-[#5c4033] bg-[#1e140d]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this position..."
            className="w-full bg-[#291b12] border border-[#5c4033] rounded-md py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#81b64c] transition-colors placeholder-[#8d6e63] text-white"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#a1887f] hover:text-white disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};