export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  history: string[]; // PGN history
  captured: { w: string[]; b: string[] };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface BotPersona {
  id: string;
  name: string;
  rating: number;
  description: string;
  style: string; // Instructions for the AI
  avatarColor: string;
  visualDescription: string;
  avatarImage: string; // Path to static image file
}

export enum GameMode {
  PLAYER_VS_AI = 'PLAYER_VS_AI', 
  ANALYSIS = 'ANALYSIS',
  PLAY_LOCAL = 'PLAY_LOCAL'
}

export interface PieceTheme {
  light: string;
  dark: string;
}