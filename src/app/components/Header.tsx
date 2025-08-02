'use client';

import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Plus, Play } from 'lucide-react';

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
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Game Tracker</h1>
            <p className="text-blue-100 text-sm">Professional Score Tracking</p>
          </div>
          
          <button
            onClick={handleNewGame}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl hover:bg-blue-50"
          >
            {currentGame ? (
              <>
                <Plus size={18} />
                <span>New Game</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Start Game</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;