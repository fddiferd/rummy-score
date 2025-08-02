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
      
      <div className="py-4 md:py-6 min-h-[calc(100vh-200px)]">
        {currentGame ? (
          <div className="lg:container lg:mx-auto lg:px-4 lg:max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full">
              <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-1">
                <div className="animate-fade-in h-full px-4 lg:px-0">
                  <GameScoreboard />
                </div>
              </div>
              <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-2">
                <div className="animate-slide-in h-full">
                  <GameList />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:container lg:mx-auto lg:px-4 lg:max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 h-full">
              <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center order-1 lg:order-1">
                <div className="animate-fade-in w-full px-4 lg:px-0">
                  <NewGameForm />
                </div>
              </div>
              <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-2">
                <div className="animate-slide-in h-full">
                  <GameList />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-6 md:py-8 text-center mt-8 md:mt-16">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-sm">
            CountMyScore &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}