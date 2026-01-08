# Grandmaster AI Chess: A Personalized Learning Platform

**A React-based chess application designed to transition players from casual movers to strategic thinkers using Generative AI.**

## 1. Project Overview
Grandmaster AI Chess is not just another board implementation; it is an interactive coaching environment. While traditional chess apps rely on numeric evaluations (e.g., "+0.5 advantage") that confuse beginners, this project utilizes Google's Gemini API to provide natural language explanations, strategic planning, and adaptive opponents.

The application features a "wooden" aesthetic reminiscent of classic chess clubs, creating a focused, premium environment for long-term learning.

## 2. The Problem
*   **The Gap:** Beginners often hit a skill plateau. They know *how* the pieces move, but not *why* a move is good.
*   **The Friction:** Traditional engines (like Stockfish) provide perfect calculation but zero instruction. "Mate in 12" is useless feedback for a novice.
*   **The Opportunity:** By using an LLM as a coach, we can explain concepts like "controlling the center" or "weak kingside" in plain English, simulating a human tutor.

## 3. Goals & Non-Goals

### Core Goals
*   **Adaptive Opponents:** Create bot "personas" (e.g., Martin, Aria, Sven) that simulate specific human ELO ranges and playing styles, rather than just making random errors.
*   **Explainable AI:** Provide real-time, conversational analysis of board states.
*   **Post-Game Growth:** Offer comprehensive game reports that highlight brilliant moves and critical mistakes.
*   **Aesthetic Immersion:** A polished, responsive UI that feels like a physical board.

### Non-Goals
*   **Multiplayer (PVP):** The focus is strictly on Human vs. AI learning loops.
*   **Super-GM Engine Strength:** We are prioritizing human-like play over beating Magnus Carlsen.
*   **Server-Side Persistence:** Currently a client-side MVP; user stats do not persist across sessions.

## 4. Architecture & Design

### High-Level Architecture
The application is a Single Page Application (SPA) built with **React 19**. It maintains game state locally and communicates with the **Google Gemini API** for intelligence (bot moves and coaching).

*   **Game Logic Layer:** Powered by `chess.js` for move validation, check/mate detection, and PGN generation.
*   **Presentation Layer:** Custom React components styled with Tailwind CSS.
*   **Intelligence Layer:** Stateless API calls to Gemini, passing the FEN (Forsyth–Edwards Notation) and move history to generate context-aware responses.

### Key Design Decisions & Trade-offs

1.  **LLM vs. Traditional Engine:**
    *   *Decision:* We use Gemini (LLM) for both bot moves and analysis.
    *   *Trade-off:* LLMs are computationally expensive and can occasionally "hallucinate" illegal moves compared to Stockfish.
    *   *Mitigation:* We use `chess.js` to validate all AI output. If the LLM suggests an illegal move, the system retries or falls back to a safe random move. The benefit is the "human-like" quality of the bot's play and its ability to explain its reasoning.

2.  **Persona-Based Bots:**
    *   *Decision:* Instead of a difficulty slider (1-100), we use named personas with visual avatars and descriptions.
    *   *Reasoning:* This increases user engagement and emotional investment. Beating "Antonio" feels more rewarding than beating "Level 5".

3.  **Client-Side Architecture:**
    *   *Decision:* No backend server; API keys are handled via environment variables.
    *   *Trade-off:* Rapid prototyping vs. Security. This structure is perfect for a portfolio/MVP but would require a proxy server for production deployment to protect API quotas.

## 5. Technology Stack

*   **React 19:** Chosen for its efficient state management and component reusability.
*   **Google Gemini API (`gemini-3-pro` & `flash`):** 
    *   *Pro* is used for deep analysis and high-rated bots.
    *   *Flash* is used for lower-rated bots to reduce latency.
    *   *Thinking Config:* Enabled to allow the model to "calculate" lines before outputting a move.
*   **Tailwind CSS:** Enables rapid styling and consistent theming (Dark/Wooden mode).
*   **Chess.js:** The industry standard library for chess logic/validation.
*   **Lucide React:** Lightweight, consistent icon set.

## 6. How to Run

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    *   Create a `.env` file in the root.
    *   Add `API_KEY=your_google_gemini_key`.
4.  **Start the development server:**
    ```bash
    npm start
    ```

## 7. Current Status
**Status:** *Functional MVP / Experimental*

*   **Completed:** Full game loop, move history, 6 bot personas, real-time coach chat, game-over analysis modal, "Wooden" UI theme.
*   **Pending:** User authentication, historical stat tracking, voice interaction.

## 8. Risks & Limitations

*   **Hallucinations:** In complex tactical positions, the AI Coach might confidently give incorrect advice.
*   **Latency:** API calls for bot moves take 1-3 seconds, which is slower than a local WASM engine.
*   **Cost:** Scaling this to thousands of users would incur significant API costs compared to running Stockfish locally.

## 9. Key Learnings
*   **Context Window Management:** Passing the full PGN (move history) is crucial. Analyzing FEN alone misses the narrative of the game (e.g., threefold repetition or castling rights).
*   **Prompt Engineering for Chess:** getting an LLM to output valid JSON moves requires strict schema definitions and fallback logic.
*   **User Psychology:** Users are more forgiving of a bot taking 3 seconds to move if the UI indicates it is "Thinking," mimicking human behavior.
