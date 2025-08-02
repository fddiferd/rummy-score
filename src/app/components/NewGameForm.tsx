'use client';

import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Users, Target, Plus, X } from 'lucide-react';

const NewGameForm: React.FC = () => {
  const { startNewGame } = useGameContext();
  const [gameName, setGameName] = useState('');
  const [targetScore, setTargetScore] = useState(500);
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [error, setError] = useState('');

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length <= 2) {
      setError('You need at least 2 players');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setPlayerNames(playerNames.filter((_, i) => i !== index));
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }
    
    const validPlayers = playerNames.filter(name => name.trim() !== '');
    if (validPlayers.length < 2) {
      setError('You need at least 2 players with names');
      return;
    }
    
    startNewGame(gameName, validPlayers, targetScore);
    
    // Reset form
    setGameName('');
    setPlayerNames(['', '']);
    setTargetScore(500);
    setError('');
  };

  return (
    <div className="bg-white shadow-lg lg:rounded-xl p-6 md:p-8 w-full border-0 lg:border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Start New Game</h2>
        <p className="text-gray-600">Set up your game and start tracking scores</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Game Name</label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
            placeholder="e.g., Some random game"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3 flex items-center space-x-2">
            <Target size={18} />
            <span>Target Score</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[300, 500, 750, 1000].map(score => (
              <button
                key={score}
                type="button"
                onClick={() => setTargetScore(score)}
                className={`p-3 rounded-lg transition-all duration-200 font-medium text-center ${
                  targetScore === score
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                }`}
              >
                {score}
                <div className="text-xs opacity-75">points</div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3 flex items-center space-x-2">
            <Users size={18} />
            <span>Players</span>
          </label>
          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-base"
                  placeholder={`Player ${index + 1} name`}
                />
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="self-start sm:self-auto p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <X size={18} />
                    <span className="sm:hidden text-sm">Remove</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addPlayer}
            className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Player</span>
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default NewGameForm;