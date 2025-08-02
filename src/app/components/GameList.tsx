'use client';

import React from 'react';
import { useGameContext } from '../context/GameContext';
import { getPlayerTotals } from '../utils/gameStorage';
import { Trophy, Users, Calendar, Clock, Play } from 'lucide-react';

const GameList: React.FC = () => {
  const { gameState, selectGame } = useGameContext();
  const { games } = gameState;
  
  if (games.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100 sticky top-6">
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
  
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <span>Game History</span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 group hover:from-blue-50 hover:to-white"
              onClick={() => selectGame(game.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {game.name}
                </h3>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 whitespace-nowrap ml-2">
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
                
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1 bg-gray-50 p-2 rounded-lg">
                    <Users size={12} className="text-gray-500" />
                    <span className="font-medium">{game.players.length} players</span>
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 p-2 rounded-lg">
                    <span className="font-medium">{game.rounds.length} rounds</span>
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 p-2 rounded-lg">
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