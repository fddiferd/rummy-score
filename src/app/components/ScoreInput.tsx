'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Round } from '../utils/types';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface ScoreInputProps {
  editingRound?: Round | null;
  onCancelEdit?: () => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ editingRound = null, onCancelEdit }) => {
  const { gameState, addRound, editRound } = useGameContext();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  // Common score values for quick selection
  const quickScores = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100, 125, 150];

  useEffect(() => {
    // If we're editing a round, populate the form with the round's scores
    if (editingRound) {
      setScores(editingRound.scores);
    } else {
      // Initialize all players with 0 scores
      const initialScores: Record<string, number> = {};
      gameState.currentGame?.players.forEach(player => {
        initialScores[player.id] = 0;
      });
      setScores(initialScores);
    }
  }, [editingRound, gameState.currentGame]);

  if (!gameState.currentGame) {
    return null;
  }

  const adjustScore = (playerId: string, delta: number) => {
    setScores(prev => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) + delta)
    }));
  };

  const setQuickScore = (playerId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [playerId]: score
    }));
  };

  const resetPlayerScore = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: 0
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
      // Reset to all zeros for next round
      const resetScores: Record<string, number> = {};
      gameState.currentGame.players.forEach(player => {
        resetScores[player.id] = 0;
      });
      setScores(resetScores);
      if (onCancelEdit) onCancelEdit(); // Hide the form after adding
    }
    
    setError('');
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    // Reset to all zeros
    const resetScores: Record<string, number> = {};
    gameState.currentGame.players.forEach(player => {
      resetScores[player.id] = 0;
    });
    setScores(resetScores);
    setError('');
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        {editingRound ? 'Edit Round Scores' : 'Add Round Scores'}
      </h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-8">
          {gameState.currentGame.players.map(player => (
            <div key={player.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{player.name}</h4>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => resetPlayerScore(player.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Reset to 0"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <div className="text-2xl font-bold text-gray-800 min-w-[60px] text-center">
                    {scores[player.id] || 0}
                  </div>
                </div>
              </div>
              
              {/* +/- Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -10)}
                  className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Minus size={20} />
                  <span className="ml-1">10</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -5)}
                  className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Minus size={16} />
                  <span className="ml-1">5</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -1)}
                  className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Minus size={12} />
                  <span className="ml-1">1</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 1)}
                  className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <Plus size={12} />
                  <span className="ml-1">1</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 5)}
                  className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  <span className="ml-1">5</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 10)}
                  className="p-3 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  <span className="ml-1">10</span>
                </button>
              </div>
              
              {/* Quick Score Selection */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickScores.map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setQuickScore(player.id, score)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      scores[player.id] === score
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {editingRound ? 'Save Changes' : 'Add Round'}
          </button>
          
          {editingRound && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
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