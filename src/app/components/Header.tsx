'use client';

import React from 'react';
import { useGameContext } from '../context/GameContext';

const Header: React.FC = () => {
  const { gameState, endGame } = useGameContext();
  const { currentGame } = gameState;
  
  const handleNewGame = () => {
    if (currentGame && !window.confirm('You have a game in progress. Start a new game instead?')) {
      return;
    }
    
    if (currentGame) {
      endGame();
    }
    
    // Reset to home page (with new game form)
    window.location.href = '/';
  };
  
  return (
    <header className="bg-indigo-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rummy 500 Scorekeeper</h1>
        
        <button
          onClick={handleNewGame}
          className="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-indigo-100"
        >
          {currentGame ? 'New Game' : 'Start Game'}
        </button>
      </div>
    </header>
  );
};

export default Header; 