'use client';

import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { getPlayerTotals } from '../utils/gameStorage';
import { Round } from '../utils/types';
import ScoreInput from './ScoreInput';
import ScoreChart from './ScoreChart';
import { Trophy, Medal, Award, Edit2, X, Plus } from 'lucide-react';

const GameScoreboard: React.FC = () => {
  const { gameState, endGame } = useGameContext();
  const { currentGame } = gameState;
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [showScoreInput, setShowScoreInput] = useState(false);
  
  if (!currentGame) {
    return null;
  }
  
  const playerTotals = getPlayerTotals(currentGame);
  
  // Sort players by score (highest first)
  const sortedPlayers = [...currentGame.players].sort((a, b) => 
    playerTotals[b.id] - playerTotals[a.id]
  );
  
  const handleEndGame = () => {
    if (window.confirm('Are you sure you want to end this game?')) {
      endGame();
    }
  };

  const handleEditRound = (round: Round) => {
    setEditingRound(round);
    setShowScoreInput(true);
    // Scroll to the score input section
    setTimeout(() => {
      document.getElementById('score-input-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddRound = () => {
    setEditingRound(null);
    setShowScoreInput(true);
    // Scroll to the score input section
    setTimeout(() => {
      document.getElementById('score-input-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingRound(null);
    setShowScoreInput(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={20} />;
      case 1:
        return <Medal className="text-gray-400" size={20} />;
      case 2:
        return <Award className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  const getRankStyling = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };
  
  return (
    <>
      <div className="bg-white shadow-lg lg:rounded-xl p-4 md:p-6 mb-6 border-0 lg:border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{currentGame.name}</h2>
            <p className="text-gray-600 mt-1">Target: {currentGame.targetScore} points</p>
          </div>
          <button
            onClick={handleEndGame}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
          >
            <X size={16} />
            <span>End Game</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Current Standings</h3>
          {!currentGame.isComplete && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              In Progress
            </span>
          )}
        </div>
        <div className="space-y-3 mb-8">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className={`p-4 rounded-lg border transition-colors ${getRankStyling(index)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(index)}
                    <span className="text-lg font-semibold text-gray-700">#{index + 1}</span>
                  </div>
                  <span className="text-lg font-medium text-gray-800">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {playerTotals[player.id] || 0}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-8 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Round History</h3>
          <button
            onClick={handleAddRound}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 shadow-lg"
          >
            <Plus size={18} />
            <span>Add Round</span>
          </button>
        </div>
        
        {currentGame.rounds.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <Plus size={48} className="mx-auto text-gray-300" />
            </div>
            <p className="text-lg font-medium">No rounds played yet</p>
            <p className="text-sm">Click "Add Round" to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 rounded-tl-lg">Round</th>
                  {currentGame.players.map(player => (
                    <th key={player.id} className="py-3 px-4 text-right text-sm font-semibold text-gray-600">{player.name}</th>
                  ))}
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGame.rounds.map((round, roundIndex) => (
                  <tr key={round.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 md:px-4 text-gray-800 font-medium text-sm">{roundIndex + 1}</td>
                    {currentGame.players.map(player => (
                      <td key={player.id} className="py-3 px-2 md:px-4 text-right text-gray-800 font-medium text-sm">
                        {round.scores[player.id] || 0}
                      </td>
                    ))}
                    <td className="py-3 px-2 md:px-4 text-right">
                      <button
                        onClick={() => handleEditRound(round)}
                        className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center space-x-1 text-xs"
                      >
                        <Edit2 size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Score Chart */}
      <ScoreChart game={currentGame} />
      
      {/* Score Input - Only show when editing or adding */}
      {showScoreInput && (
        <div id="score-input-section">
          <ScoreInput 
            editingRound={editingRound} 
            onCancelEdit={handleCancelEdit} 
          />
        </div>
      )}

      {/* Floating Action Button for Adding Rounds (when there are existing rounds and form is not open) */}
      {!showScoreInput && currentGame.rounds.length > 0 && (
        <button
          onClick={handleAddRound}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
          title="Add Round"
        >
          <Plus size={24} />
        </button>
      )}
    </>
  );
};

export default GameScoreboard;