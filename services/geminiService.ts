import { GoogleGenAI, Type } from "@google/genai";
import { BotPersona } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzePosition = async (fen: string, history: string[], lastMove: string | null): Promise<string> => {
  try {
    const turn = fen.split(' ')[1]; // 'w' or 'b'
    const isUserTurn = turn === 'w'; // User is always White in current App configuration

    const prompt = `
      You are a world-class Chess Grandmaster and Coach. 
      Analyze the current chess position from the perspective of the **White player (The User)**.
      
      **Current State:**
      - FEN: ${fen}
      - Move History (PGN): ${history.join(' ')}
      - Last Move: ${lastMove || 'None (Start of game)'}
      - Side to Move: ${isUserTurn ? "White" : "Black"}
      
      **Instructions:**
      1. **Evaluation:** Briefly evaluate the position for White. (e.g. "White has a space advantage", "White is under pressure").
      2. **Context:**
         ${isUserTurn 
            ? "- Analyze Black's last move. Is there a threat?" 
            : "- Analyze the move White just played. Was it a good move?"}
      3. **Plan:**
         ${isUserTurn
            ? "- Suggest the best strategic plan and candidate move for White."
            : "- Anticipate what Black will likely do next and how White should prepare to respond."}
      
      Keep the tone encouraging, educational, and concise (under 200 words). Use Markdown for clarity (bold key moves).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly, helpful chess coach.",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "I couldn't analyze this position right now.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "The coach is currently taking a break (API Error). Please try again.";
  }
};

export const chatWithCoach = async (message: string, fen: string, history: string[]): Promise<string> => {
    try {
        const prompt = `
        Context:
        - FEN: ${fen}
        - History: ${history.join(' ')}
        
        User Question: "${message}"
        
        Answer the user's question specifically about this chess position or general chess concepts. Be concise and helpful.
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingBudget: 32768 }
          }
        });
    
        return response.text || "I'm not sure what to say.";
      } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I can't answer that right now.";
      }
}

export const getBotMove = async (fen: string, validMoves: string[], persona: BotPersona): Promise<string | null> => {
  try {
    const prompt = `
      You are playing a game of chess. 
      
      **Identity:**
      Name: ${persona.name}
      Rating: ${persona.rating}
      Playing Style: ${persona.style}
      
      **Game State:**
      Current FEN: ${fen}
      Valid Moves (SAN): ${validMoves.join(', ')}
      
      **Task:**
      Select a move from the "Valid Moves" list that reflects your rating and style. 
      - If you are low rated (1100), you might pick a suboptimal move or valid blunder occasionally.
      - If you are high rated (2000+), pick the best possible move.
      
      Return ONLY the move string in JSON format.
    `;

    // Use Gemini 3 Pro for higher rated bots (1700+) to leverage reasoning
    const isHighRated = persona.rating >= 1700;
    const model = isHighRated ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    const config: any = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: { type: Type.STRING }
          }
        }
    };

    if (isHighRated) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    const json = JSON.parse(response.text || '{}');
    return json.move || null;
  } catch (error) {
    console.error("Gemini Bot Move Error:", error);
    // Fallback to random move if API fails, handled by caller or return null
    return null;
  }
}

export const analyzeFullGame = async (history: string[]): Promise<string> => {
  try {
    const prompt = `
      You are a world-class Chess Coach. The user (White) just finished a game.
      
      **Game History (PGN):**
      ${history.join(' ')}
      
      **Task:**
      Provide a comprehensive post-game analysis report in Markdown.
      
      **Structure:**
      1. **Overall Rating (1-5 Stars):** Rate the user's play based on accuracy and logic.
      2. **Summary:** A 2-sentence summary of the game flow.
      3. **Key Moments:**
         - **Brilliant Moves:** Highlight any great moves by White (if any).
         - **Missed Opportunities/Mistakes:** Identify the critical moments where White went wrong.
      4. **Step-by-Step Critical Review:** briefly list the move numbers that were pivotal and why.
      
      Be constructive but honest. The goal is to help the user improve.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "I couldn't generate the game report at this time.";
  } catch (error) {
    console.error("Gemini Full Game Analysis Error:", error);
    return "Error generating analysis report.";
  }
}