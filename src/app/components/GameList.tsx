'use client';

import React from 'react';
import { useGameContext } from '../context/GameContext';
import { getPlayerTotals } from '../utils/gameStorage';
import { Trophy, Users, Calendar, Clock, Play, X } from 'lucide-react';

const GameList: React.FC = () => {
  const { gameState, selectGame, deleteGame } = useGameContext();
  const { games } = gameState;
  
  if (games.length === 0) {
    return (
      <div className="bg-white shadow-lg lg:rounded-xl p-6 md:p-8 text-center border-0 lg:border border-gray-100 lg:sticky lg:top-6">
        <div className="text-gray-300 mb-4">
          <Play size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No games yet</h3>
        <p className="text-gray-600">Start your first game to begin tracking scores!</p>
      </div>
    );
  }
  
  // Sort games by date (newest first)
  const sortedGames = [...games].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteGame = (e: React.MouseEvent, gameId: string, gameName: string) => {
    e.stopPropagation(); // Prevent triggering selectGame
    
    if (window.confirm(`Are you sure you want to delete "${gameName}"? This action cannot be undone.`)) {
      deleteGame(gameId);
    }
  };
  
  return (
    <div className="bg-white shadow-lg lg:rounded-xl border-0 lg:border border-gray-100 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={18} className="text-blue-600" />
          </div>
          <span>Game History</span>
        </h2>
      </div>
      
      <div className="flex-1 lg:overflow-y-auto p-4 md:p-6 space-y-4">
        {sortedGames.map(game => {
          const playerTotals = getPlayerTotals(game);
          
          // Find winner (player with highest score)
          let winnerId = game.players[0]?.id;
          game.players.forEach(player => {
            if (playerTotals[player.id] > playerTotals[winnerId]) {
              winnerId = player.id;
            }
          });
          
          const winner = game.players.find(p => p.id === winnerId);
          const dateFormatted = new Date(game.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          
          return (
            <div 
              key={game.id} 
              className="relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 md:p-5 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 group hover:from-blue-50 hover:to-white"
              onClick={() => selectGame(game.id)}
            >
              {/* Delete button - appears on hover */}
              <button
                onClick={(e) => handleDeleteGame(e, game.id, game.name)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-lg z-10"
                title={`Delete ${game.name}`}
              >
                <X size={14} />
              </button>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0 mb-4">
                <h3 className="font-bold text-base md:text-lg text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {game.name}
                </h3>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 whitespace-nowrap self-start sm:ml-2">
                  <Calendar size={12} />
                  <span>{dateFormatted}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {game.isComplete ? (
                  <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg">
                    <Trophy size={18} className="text-yellow-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-semibold text-yellow-800">Winner: {winner?.name}</div>
                      <div className="text-yellow-600">{playerTotals[winnerId]} points</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                    <Clock size={18} className="text-blue-600 flex-shrink-0" />
                    <div className="text-sm font-semibold text-blue-800">Game in progress</div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg min-w-0">
                    <Users size={12} className="text-gray-500 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">{game.players.length} players</span>
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium">{game.rounds.length} rounds</span>
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 p-2 rounded-lg col-span-2 md:col-span-1">
                    <span className="font-medium">{game.targetScore} pts</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameList;