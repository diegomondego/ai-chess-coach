import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Chess, Move, Piece } from 'chess.js';
import { Board } from './components/Board';
import { CoachPanel } from './components/CoachPanel';
import { MoveHistory } from './components/MoveHistory';
import { BotSelection } from './components/BotSelection';
import { Avatar } from './components/Avatar';
import { CapturedPieces } from './components/CapturedPieces';
import { GameOverModal } from './components/GameOverModal';
import { RotateCcw, Settings, Bot, ArrowLeft, Undo, ChevronUp, ChevronDown } from 'lucide-react';
import { BotPersona } from './types';
import { getBotMove } from './services/geminiService';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState<string[]>([]);
  const [fen, setFen] = useState(game.fen());
  
  // Game Modes
  const [view, setView] = useState<'selection' | 'game'>('selection'); 
  const [selectedBot, setSelectedBot] = useState<BotPersona | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Layout State
  const [isMoveListCollapsed, setIsMoveListCollapsed] = useState(false);

  // Game Over State
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [gameOverResult, setGameOverResult] = useState<{winner: 'w' | 'b' | 'draw' | null, reason: string}>({winner: null, reason: ''});
  const [hasShownGameOver, setHasShownGameOver] = useState(false);
  const [analysisTrigger, setAnalysisTrigger] = useState<number>(0);

  // Derived State: Captured Pieces & Score
  const { capturedByWhite, capturedByBlack, whiteScore, blackScore } = useMemo(() => {
    // 1. Get captured pieces from history
    const historyVerbose = game.history({ verbose: true });
    const capturedByW: string[] = [];
    const capturedByB: string[] = [];

    historyVerbose.forEach(move => {
      if (move.captured) {
        if (move.color === 'w') {
          capturedByW.push(move.captured); // White captured a piece
        } else {
          capturedByB.push(move.captured); // Black captured a piece
        }
      }
    });

    // 2. Calculate material score from current board
    // We count material on the board to account for promotions accurately
    const board = game.board();
    let wScore = 0;
    let bScore = 0;
    
    const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    board.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          if (piece.color === 'w') wScore += values[piece.type];
          else bScore += values[piece.type];
        }
      });
    });

    return {
      capturedByWhite: capturedByW,
      capturedByBlack: capturedByB,
      whiteScore: wScore,
      blackScore: bScore
    };
  }, [fen]); // Recalculate when FEN changes

  const materialDiff = whiteScore - blackScore;

  // Check for Game Over
  useEffect(() => {
    if (game.isGameOver() && !hasShownGameOver) {
      let winner: 'w' | 'b' | 'draw' | null = null;
      let reason = '';

      if (game.isCheckmate()) {
        winner = game.turn() === 'w' ? 'b' : 'w';
        reason = 'Checkmate';
      } else if (game.isDraw()) {
        winner = 'draw';
        if (game.isStalemate()) reason = 'Stalemate';
        else if (game.isThreefoldRepetition()) reason = 'Repetition';
        else if (game.isInsufficientMaterial()) reason = 'Insufficient Material';
        else reason = 'Draw';
      }

      setGameOverResult({ winner, reason });
      setIsGameOverModalOpen(true);
      setHasShownGameOver(true);
      setIsBotThinking(false); // Stop bot if it was thinking
    }
  }, [game, fen, hasShownGameOver]);


  // Handle User Move
  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    // Prevent moving if it's bot's turn
    if (selectedBot && game.turn() === 'b') return;
    if (game.isGameOver()) return;

    try {
      const result = game.move(move);
      if (result) {
        setFen(game.fen());
        setHistory(game.history());
      }
    } catch (e) {
      console.warn('Invalid move attempted');
    }
  }, [game, selectedBot]);

  const undoMove = useCallback(() => {
    if (game.history().length === 0) return;

    // Smart Undo for Bot Mode
    if (selectedBot) {
      if (game.turn() === 'w') {
        game.undo(); // Undo Bot
        game.undo(); // Undo Player
      } else {
        game.undo();
      }
    } else {
      game.undo();
    }

    setIsBotThinking(false); 
    setHasShownGameOver(false); // Allow game over to trigger again if we replay
    setFen(game.fen());
    setHistory(game.history());
  }, [game, selectedBot]);

  // Bot Logic Effect
  useEffect(() => {
    const triggerBotMove = async () => {
      if (!selectedBot || game.turn() !== 'b' || game.isGameOver()) return;

      setIsBotThinking(true);
      
      const validMoves = game.moves();
      
      const botMoveSan = await getBotMove(game.fen(), validMoves, selectedBot);
      
      setIsBotThinking(false);

      if (botMoveSan) {
        try {
          game.move(botMoveSan);
          setFen(game.fen());
          setHistory(game.history());
        } catch (e) {
          console.error("Bot tried invalid move:", botMoveSan);
          // Fallback
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          game.move(randomMove);
          setFen(game.fen());
          setHistory(game.history());
        }
      } else {
         // Fallback
         const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
         game.move(randomMove);
         setFen(game.fen());
         setHistory(game.history());
      }
    };

    triggerBotMove();
  }, [fen, game, selectedBot]); 

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setHistory([]);
    setIsBotThinking(false);
    setIsGameOverModalOpen(false);
    setHasShownGameOver(false);
    setAnalysisTrigger(0);
  };

  const handleSelectBot = (bot: BotPersona) => {
    setSelectedBot(bot);
    resetGame();
    setView('game');
  };

  const backToMenu = () => {
    setView('selection');
    setSelectedBot(null);
    setIsGameOverModalOpen(false);
    setHasShownGameOver(false);
  };

  const handleStartAnalysis = () => {
      setIsGameOverModalOpen(false);
      setAnalysisTrigger(Date.now());
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#3c2a1e] text-[#e0d3c5] overflow-hidden">
      
      <GameOverModal 
        isOpen={isGameOverModalOpen}
        winner={gameOverResult.winner}
        reason={gameOverResult.reason}
        onNewGame={resetGame}
        onAnalyze={handleStartAnalysis}
        onMenu={backToMenu}
      />

      {/* Left Sidebar / Nav (Desktop only mainly) */}
      <div className="hidden md:flex w-20 flex-col items-center py-4 bg-[#291b12] border-r border-[#5c4033] gap-6">
        <div className="text-[#81b64c] font-black text-2xl tracking-tighter cursor-pointer" onClick={backToMenu}>AI.C</div>
        <div className="flex flex-col gap-4 w-full px-2">
            <button 
                className={`p-3 rounded-lg transition-colors ${view === 'selection' ? 'bg-[#4e342e] text-white' : 'text-[#a1887f] hover:text-white hover:bg-[#4e342e]'}`} 
                title="Play vs Computer"
                onClick={backToMenu}
            >
                <Bot className="w-6 h-6" />
            </button>
            {view === 'game' && (
                <>
                    <button 
                        className="p-3 rounded-lg hover:bg-[#4e342e] transition-colors text-[#a1887f] hover:text-white" 
                        title="New Game" 
                        onClick={resetGame}
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    <button 
                        className="p-3 rounded-lg hover:bg-[#4e342e] transition-colors text-[#a1887f] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" 
                        title="Undo Move" 
                        onClick={undoMove}
                        disabled={history.length === 0 || isBotThinking}
                    >
                        <Undo className="w-6 h-6" />
                    </button>
                </>
            )}
            <button className="p-3 rounded-lg hover:bg-[#4e342e] transition-colors text-[#a1887f] hover:text-white" title="Settings">
                <Settings className="w-6 h-6" />
            </button>
        </div>
      </div>

      {view === 'selection' ? (
        <BotSelection onSelectBot={handleSelectBot} />
      ) : (
        <>
            {/* Main Board Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-6 bg-[#3c2a1e] relative">
                
                {/* Mobile Header */}
                <div className="md:hidden w-full flex justify-between items-center mb-4 px-2">
                    <button onClick={backToMenu}><ArrowLeft className="w-5 h-5 text-[#a1887f]" /></button>
                    <span className="text-[#81b64c] font-black text-xl">AI.Chess</span>
                    <div className="flex gap-2">
                        <button onClick={undoMove} disabled={history.length === 0 || isBotThinking} className="disabled:opacity-30">
                             <Undo className="w-5 h-5 text-[#a1887f]" />
                        </button>
                        <button onClick={resetGame}>
                             <RotateCcw className="w-5 h-5 text-[#a1887f]" />
                        </button>
                    </div>
                </div>

                {/* Player Info Top (Bot/Opponent) */}
                <div className="w-full max-w-[80vh] flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-3">
                        {selectedBot ? (
                            <Avatar 
                                id={selectedBot.id}
                                src={selectedBot.avatarImage}
                                description={selectedBot.visualDescription}
                                fallbackText={selectedBot.name[0]}
                                fallbackColor={selectedBot.avatarColor}
                                className="w-10 h-10 rounded-md"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-[#4e342e] rounded-md"></div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-semibold text-white text-sm flex items-center gap-2">
                                {selectedBot ? selectedBot.name : 'Opponent'}
                                {isBotThinking && <span className="text-[10px] text-[#81b64c] animate-pulse">thinking...</span>}
                            </span>
                            <span className="text-xs text-[#a1887f]">Rating: {selectedBot ? selectedBot.rating : '1500?'}</span>
                        </div>
                    </div>
                    {/* Captured by Opponent (White pieces lost) */}
                    <CapturedPieces 
                        pieces={capturedByBlack} 
                        color="w" 
                        score={materialDiff < 0 ? Math.abs(materialDiff) : undefined} 
                    />
                </div>

                <Board game={game} onMove={makeMove} orientation="w" />
                
                {/* Player Info Bottom (White) */}
                <div className="w-full max-w-[80vh] flex items-center justify-between mt-2 px-1">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            id="user_player"
                            src="/user.png"
                            description="User Avatar"
                            fallbackText="Me"
                            fallbackColor="#81b64c"
                            className="w-10 h-10 rounded-md"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-white text-sm">You</span>
                            <span className="text-xs text-[#a1887f]">Rating: 1200</span>
                        </div>
                    </div>
                    <CapturedPieces 
                        pieces={capturedByWhite} 
                        color="b" 
                        score={materialDiff > 0 ? materialDiff : undefined} 
                    />
                </div>
            </div>

            {/* Right Sidebar - Coach & History */}
            <div className="w-full md:w-[400px] bg-[#291b12] border-l border-[#5c4033] flex flex-col h-[40vh] md:h-full">
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Move History Section */}
                    <div 
                        className={`border-b border-[#5c4033] flex flex-col transition-all duration-300 ease-in-out ${
                            isMoveListCollapsed ? 'h-[40px] min-h-[40px]' : 'h-1/3 min-h-[150px]'
                        }`}
                    >
                         {/* Header with Toggle */}
                         <div className="flex items-center justify-between px-3 py-2 bg-[#1e140d] border-b border-[#5c4033] shrink-0 h-[40px]">
                              <span className="text-xs font-semibold text-[#a1887f] uppercase tracking-wider">Move List</span>
                              <button 
                                  onClick={() => setIsMoveListCollapsed(!isMoveListCollapsed)}
                                  className="text-[#a1887f] hover:text-white transition-colors p-1 hover:bg-[#4e342e] rounded"
                                  title={isMoveListCollapsed ? "Expand" : "Collapse"}
                              >
                                  {isMoveListCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                         </div>
                        
                        <div className={`flex-1 overflow-hidden ${isMoveListCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-opacity duration-200`}>
                            <MoveHistory history={history} />
                        </div>
                    </div>
                    
                    {/* Coach Chat Section */}
                    <div className="flex-1 min-h-0">
                        <CoachPanel game={game} history={history} analysisTrigger={analysisTrigger} />
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
}