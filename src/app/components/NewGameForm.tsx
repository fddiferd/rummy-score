'use client';

import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';

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
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Start New Game</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black mb-2">Game Name</label>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-black"
            placeholder="e.g., Game Night July 2023"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-black mb-2">Target Score</label>
          <input
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-black"
            min="100"
            step="100"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-black mb-2">Players</label>
          {playerNames.map((name, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-black"
                placeholder={`Player ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removePlayer(index)}
                className="bg-red-500 text-white px-3 rounded-r hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addPlayer}
            className="mt-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded w-full hover:bg-indigo-200"
          >
            + Add Player
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default NewGameForm; 