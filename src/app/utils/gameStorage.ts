import { Game, GameState } from './types';

const STORAGE_KEY = 'countmyscore_game_data';

export const getInitialGameState = (): GameState => {
  if (typeof window === 'undefined') {
    return { games: [], currentGame: null };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { games: [], currentGame: null };
  }
  
  try {
    return JSON.parse(stored) as GameState;
  } catch (e) {
    console.error('Failed to parse stored game data:', e);
    return { games: [], currentGame: null };
  }
};

export const saveGameState = (state: GameState): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const createNewGame = (name: string, players: string[], targetScore: number = 500): Game => {
  return {
    id: Date.now().toString(),
    name,
    date: new Date().toISOString(),
    players: players.map(name => ({ id: Math.random().toString(36).substring(2, 9), name })),
    rounds: [],
    targetScore,
    isComplete: false
  };
};

export const addRound = (game: Game, scores: Record<string, number>): Game => {
  const newRound = {
    id: Date.now().toString(),
    scores
  };
  
  // Check if game is complete
  const playerTotals = getPlayerTotals(game, scores);
  const isComplete = Object.values(playerTotals).some(total => total >= game.targetScore);
  
  return {
    ...game,
    rounds: [...game.rounds, newRound],
    isComplete
  };
};

export const getPlayerTotals = (game: Game, newScores?: Record<string, number>): Record<string, number> => {
  const totals: Record<string, number> = {};
  
  // Initialize totals for all players
  game.players.forEach(player => {
    totals[player.id] = 0;
  });
  
  // Sum up scores from all rounds
  game.rounds.forEach(round => {
    Object.entries(round.scores).forEach(([playerId, score]) => {
      totals[playerId] = (totals[playerId] || 0) + score;
    });
  });
  
  // Add new scores if provided
  if (newScores) {
    Object.entries(newScores).forEach(([playerId, score]) => {
      totals[playerId] = (totals[playerId] || 0) + score;
    });
  }
  
  return totals;
}; 