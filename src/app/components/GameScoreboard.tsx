'use client';

import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { getPlayerTotals } from '../utils/gameStorage';
import { Round } from '../utils/types';
import ScoreInput from './ScoreInput';

const GameScoreboard: React.FC = () => {
  const { gameState, endGame } = useGameContext();
  const { currentGame } = gameState;
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  
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
    // Scroll to the score input section
    setTimeout(() => {
      document.getElementById('score-input-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-700">{currentGame.name}</h2>
          <button
            onClick={handleEndGame}
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
          >
            End Game
          </button>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-black">Current Standings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">Player</th>
                <th className="py-2 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-black">{index + 1}</td>
                  <td className="py-2 px-4 text-black">{player.name}</td>
                  <td className="py-2 px-4 text-right text-black">
                    {playerTotals[player.id] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <h3 className="text-lg font-semibold mt-6 mb-2 text-black">Round History</h3>
        {currentGame.rounds.length === 0 ? (
          <p className="text-black italic">No rounds played yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="py-2 px-4 text-left">Round</th>
                  {currentGame.players.map(player => (
                    <th key={player.id} className="py-2 px-4 text-right">{player.name}</th>
                  ))}
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGame.rounds.map((round, roundIndex) => (
                  <tr key={round.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-black">{roundIndex + 1}</td>
                    {currentGame.players.map(player => (
                      <td key={player.id} className="py-2 px-4 text-right text-black">
                        {round.scores[player.id] || 0}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleEditRound(round)}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div id="score-input-section">
        <ScoreInput 
          editingRound={editingRound} 
          onCancelEdit={() => setEditingRound(null)} 
        />
      </div>
    </>
  );
};

export default GameScoreboard; 