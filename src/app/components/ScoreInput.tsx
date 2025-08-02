'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Round } from '../utils/types';
import { Minus, Plus, RotateCcw, Pencil, Check, X } from 'lucide-react';

interface ScoreInputProps {
  editingRound?: Round | null;
  onCancelEdit?: () => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ editingRound = null, onCancelEdit }) => {
  const { gameState, addRound, editRound } = useGameContext();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState<Record<string, boolean>>({});
  const [tempInputValues, setTempInputValues] = useState<Record<string, string>>({});

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
    setInputMode(prev => ({ ...prev, [playerId]: false }));
    setTempInputValues(prev => ({ ...prev, [playerId]: '' }));
  };

  const toggleInputMode = (playerId: string) => {
    setInputMode(prev => {
      const newMode = !prev[playerId];
      if (newMode) {
        // Switching to input mode - populate with current score
        setTempInputValues(prevTemp => ({
          ...prevTemp,
          [playerId]: String(scores[playerId] || 0)
        }));
      } else {
        // Switching back to button mode - apply the input value
        const inputValue = tempInputValues[playerId];
        if (inputValue !== undefined && inputValue !== '') {
          const numValue = Math.max(0, parseInt(inputValue) || 0);
          setScores(prevScores => ({
            ...prevScores,
            [playerId]: numValue
          }));
        }
      }
      return { ...prev, [playerId]: newMode };
    });
  };

  const handleDirectInput = (playerId: string, value: string) => {
    // Allow only numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setTempInputValues(prev => ({
      ...prev,
      [playerId]: numericValue
    }));
  };

  const applyDirectInput = (playerId: string) => {
    const inputValue = tempInputValues[playerId];
    if (inputValue !== undefined && inputValue !== '') {
      const numValue = Math.max(0, parseInt(inputValue) || 0);
      setScores(prev => ({
        ...prev,
        [playerId]: numValue
      }));
    }
    setInputMode(prev => ({ ...prev, [playerId]: false }));
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
      // Check if any player will reach the target score with this round
      const currentTotals: Record<string, number> = {};
      gameState.currentGame!.players.forEach(player => {
        const currentTotal = gameState.currentGame!.rounds.reduce((total, round) => {
          return total + (round.scores[player.id] || 0);
        }, 0);
        currentTotals[player.id] = currentTotal + (scores[player.id] || 0);
      });
      
      const playerReachedTarget = gameState.currentGame!.players.find(player => 
        currentTotals[player.id] >= gameState.currentGame!.targetScore
      );
      
      if (playerReachedTarget && !window.confirm(
        `${playerReachedTarget.name} has reached the target score of ${gameState.currentGame!.targetScore}! Do you want to end the game?`
      )) {
        return; // Don't add the round if user cancels
      }
      
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
    <div className="bg-white shadow-lg lg:rounded-xl p-4 md:p-6 mb-6 border-0 lg:border border-gray-100">
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
            <div key={player.id} className="bg-gray-50 rounded-lg p-3 md:p-4">
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
                  <button
                    type="button"
                    onClick={() => toggleInputMode(player.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      inputMode[player.id]
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Type score directly"
                  >
                    <Pencil size={18} />
                  </button>
                  {inputMode[player.id] ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempInputValues[player.id] || ''}
                        onChange={(e) => handleDirectInput(player.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            applyDirectInput(player.id);
                          } else if (e.key === 'Escape') {
                            setInputMode(prev => ({ ...prev, [player.id]: false }));
                          }
                        }}
                        className="w-20 px-3 py-2 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => applyDirectInput(player.id)}
                        className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                        title="Apply"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode(prev => ({ ...prev, [player.id]: false }))}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-800 min-w-[60px] text-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                      {scores[player.id] || 0}
                    </div>
                  )}
                </div>
              </div>
              
              {/* +/- Controls */}
              <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -10)}
                  className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors text-sm"
                >
                  <Minus size={16} />
                  <span className="ml-1">10</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -5)}
                  className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors text-sm"
                >
                  <Minus size={14} />
                  <span className="ml-1">5</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, -1)}
                  className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors text-sm"
                >
                  <Minus size={12} />
                  <span className="ml-1">1</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 1)}
                  className="px-3 py-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors text-sm"
                >
                  <Plus size={12} />
                  <span className="ml-1">1</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 5)}
                  className="px-3 py-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors text-sm"
                >
                  <Plus size={14} />
                  <span className="ml-1">5</span>
                </button>
                <button
                  type="button"
                  onClick={() => adjustScore(player.id, 10)}
                  className="px-3 py-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors text-sm"
                >
                  <Plus size={16} />
                  <span className="ml-1">10</span>
                </button>
              </div>
              
              {/* Quick Score Selection */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickScores.map(score => {
                    const isSelected = scores[player.id] === score;
                    const isClose = Math.abs((scores[player.id] || 0) - score) <= 2 && score !== 0;
                    
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setQuickScore(player.id, score)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                            : isClose
                            ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                        }`}
                      >
                        {score}
                        {isSelected && (
                          <span className="ml-1 text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                

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