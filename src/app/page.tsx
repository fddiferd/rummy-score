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
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto py-6 px-4 max-w-7xl min-h-[calc(100vh-200px)]">
        {currentGame ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="animate-fade-in h-full">
                <GameScoreboard />
              </div>
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="animate-slide-in h-full">
                <GameList />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center">
              <div className="animate-fade-in w-full max-w-2xl">
                <NewGameForm />
              </div>
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="animate-slide-in h-full">
                <GameList />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-8 text-center mt-16">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-sm">
            Game Tracker &copy; {new Date().getFullYear()}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Professional score tracking for game enthusiasts
          </p>
        </div>
      </footer>
    </main>
  );
}