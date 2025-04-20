'use client';

import React from 'react';
import { useGameContext } from '../context/GameContext';
import { getPlayerTotals } from '../utils/gameStorage';

const GameList: React.FC = () => {
  const { gameState, selectGame } = useGameContext();
  const { games } = gameState;
  
  if (games.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-black">No games yet. Start a new game!</p>
      </div>
    );
  }
  
  // Sort games by date (newest first)
  const sortedGames = [...games].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Game History</h2>
      
      <div className="space-y-4">
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
          const dateFormatted = new Date(game.date).toLocaleDateString();
          
          return (
            <div 
              key={game.id} 
              className="border rounded p-4 hover:bg-black-50 cursor-pointer"
              onClick={() => selectGame(game.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-black">{game.name}</h3>
                <span className="text-sm text-black">{dateFormatted}</span>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-black">
                  {game.isComplete ? (
                    <>
                      Winner: <span className="font-medium text-black">{winner?.name}</span> ({playerTotals[winnerId]} points)
                    </>
                  ) : (
                    <span className="text-indigo-600">Game in progress</span>
                  )}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-black">
                {game.players.length} players • {game.rounds.length} rounds
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameList; 