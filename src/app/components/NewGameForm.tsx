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
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg mx-auto border border-gray-100">
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
            placeholder="e.g., Game Night - July 2024"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2 flex items-center space-x-2">
            <Target size={18} />
            <span>Target Score</span>
          </label>
          <select
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          >
            <option value={300}>300 points</option>
            <option value={500}>500 points</option>
            <option value={750}>750 points</option>
            <option value={1000}>1000 points</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-3 flex items-center space-x-2">
            <Users size={18} />
            <span>Players</span>
          </label>
          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                  placeholder={`Player ${index + 1} name`}
                />
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addPlayer}
            className="mt-3 w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Player</span>
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default NewGameForm;