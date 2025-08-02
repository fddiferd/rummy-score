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
    <header className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg overflow-hidden">
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 0.5px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-4 md:px-6 md:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Simple Logo/Icon */}
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">Σ</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
                CountMyScore
              </h1>
              <p className="text-blue-200/80 text-sm md:text-base font-medium tracking-wide flex items-center space-x-2">
                <span className="sm:hidden">Score Tracking</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            {currentGame && (
              <div className="hidden md:block text-right bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-blue-200/80 text-xs font-medium uppercase tracking-wider">Current Game</p>
                <p className="text-white font-bold text-sm truncate max-w-[150px] mt-1">{currentGame.name}</p>
              </div>
            )}
            
            <button
              onClick={handleNewGame}
              className="bg-white text-blue-600 px-4 py-3 md:px-6 md:py-3 rounded-xl transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transform"
            >
              {currentGame ? (
                <>
                  <Plus size={18} />
                  <span className="hidden sm:inline">New Game</span>
                  <span className="sm:hidden">New</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span className="hidden sm:inline">Start Game</span>
                  <span className="sm:hidden">Start</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Simple bottom border */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
    </header>
  );
};

export default Header;