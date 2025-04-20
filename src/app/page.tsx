'use client';

import React from 'react';
import Header from './components/Header';
import NewGameForm from './components/NewGameForm';
import GameScoreboard from './components/GameScoreboard';
import GameList from './components/GameList';
import { useGameContext } from './context/GameContext';

export default function Home() {
  const { gameState } = useGameContext();
  const { currentGame } = gameState;
  
  return (
    <main>
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        {currentGame ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GameScoreboard />
            </div>
            <div>
              <GameList />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewGameForm />
            </div>
            <div>
              <GameList />
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-100 py-4 text-center text-black mt-8">
        <p>Rummy 500 Scorekeeper &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
