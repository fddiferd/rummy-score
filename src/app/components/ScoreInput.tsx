'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Round } from '../utils/types';

interface ScoreInputProps {
  editingRound?: Round | null;
  onCancelEdit?: () => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ editingRound = null, onCancelEdit }) => {
  const { gameState, addRound, editRound } = useGameContext();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    // If we're editing a round, populate the form with the round's scores
    if (editingRound) {
      setScores(editingRound.scores);
    } else {
      setScores({});
    }
  }, [editingRound]);

  if (!gameState.currentGame) {
    return null;
  }

  const handleScoreChange = (playerId: string, value: string) => {
    const score = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(score)) return;
    
    setScores(prev => ({
      ...prev,
      [playerId]: score
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all players have scores
    const allPlayersHaveScores = gameState.currentGame!.players.every(
      player => scores[player.id] !== undefined
    );
    
    if (!allPlayersHaveScores) {
      setError('Please enter scores for all players');
      return;
    }
    
    if (editingRound) {
      editRound(editingRound.id, scores);
      if (onCancelEdit) onCancelEdit(); // Cancel edit mode after saving
    } else {
      addRound(scores);
      setScores({});
    }
    
    setError('');
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    setScores({});
    setError('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">
        {editingRound ? 'Edit Round' : 'Add Round Scores'}
      </h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-4">
          {gameState.currentGame.players.map(player => (
            <div key={player.id} className="flex items-center">
              <label className="w-1/3 text-black">{player.name}</label>
              <input
                type="number"
                value={scores[player.id] || ''}
                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                className="w-2/3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-black"
                placeholder="0"
              />
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            {editingRound ? 'Save Changes' : 'Add Round'}
          </button>
          
          {editingRound && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ScoreInput; 