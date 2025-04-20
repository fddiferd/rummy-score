'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, GameState, Player, Round } from '../utils/types';
import { 
  getInitialGameState, 
  saveGameState, 
  createNewGame as createGame,
  addRound as addGameRound,
  getPlayerTotals as calculatePlayerTotals 
} from '../utils/gameStorage';

interface GameContextType {
  gameState: GameState;
  startNewGame: (name: string, players: string[], targetScore?: number) => void;
  addRound: (scores: Record<string, number>) => void;
  editRound: (roundId: string, scores: Record<string, number>) => void;
  endGame: () => void;
  selectGame: (gameId: string) => void;
  getPlayerTotals: (playerId: string) => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({ games: [], currentGame: null });
  
  useEffect(() => {
    // Initialize state from localStorage
    setGameState(getInitialGameState());
  }, []);
  
  useEffect(() => {
    // Save state to localStorage whenever it changes
    saveGameState(gameState);
  }, [gameState]);
  
  const startNewGame = (name: string, players: string[], targetScore = 500) => {
    const newGame = createGame(name, players, targetScore);
    setGameState(prev => ({
      ...prev,
      games: [...prev.games, newGame],
      currentGame: newGame
    }));
  };
  
  const addRound = (scores: Record<string, number>) => {
    if (!gameState.currentGame) return;
    
    const updatedGame = addGameRound(gameState.currentGame, scores);
    
    setGameState(prev => ({
      ...prev,
      games: prev.games.map(g => 
        g.id === updatedGame.id ? updatedGame : g
      ),
      currentGame: updatedGame
    }));
  };
  
  const editRound = (roundId: string, scores: Record<string, number>) => {
    if (!gameState.currentGame) return;
    
    const updatedRounds = gameState.currentGame.rounds.map(round => 
      round.id === roundId ? { ...round, scores } : round
    );
    
    const updatedGame = {
      ...gameState.currentGame,
      rounds: updatedRounds
    };
    
    // Recalculate if game is complete
    const playerTotals = calculatePlayerTotals(updatedGame);
    const isComplete = Object.values(playerTotals).some(total => total >= updatedGame.targetScore);
    
    const finalUpdatedGame = {
      ...updatedGame,
      isComplete
    };
    
    setGameState(prev => ({
      ...prev,
      games: prev.games.map(g => 
        g.id === finalUpdatedGame.id ? finalUpdatedGame : g
      ),
      currentGame: finalUpdatedGame
    }));
  };
  
  const endGame = () => {
    if (!gameState.currentGame) return;
    
    const completedGame = {
      ...gameState.currentGame,
      isComplete: true
    };
    
    setGameState(prev => ({
      ...prev,
      games: prev.games.map(g => 
        g.id === completedGame.id ? completedGame : g
      ),
      currentGame: null
    }));
  };
  
  const selectGame = (gameId: string) => {
    const selected = gameState.games.find(g => g.id === gameId) || null;
    setGameState(prev => ({
      ...prev,
      currentGame: selected
    }));
  };
  
  const getPlayerTotals = (playerId: string): number => {
    if (!gameState.currentGame) return 0;
    
    return gameState.currentGame.rounds.reduce((total, round) => {
      return total + (round.scores[playerId] || 0);
    }, 0);
  };
  
  return (
    <GameContext.Provider value={{
      gameState,
      startNewGame,
      addRound,
      editRound,
      endGame,
      selectGame,
      getPlayerTotals
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 