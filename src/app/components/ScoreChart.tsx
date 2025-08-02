'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Game } from '../utils/types';

interface ScoreChartProps {
  game: Game;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ game }) => {
  if (!game || game.rounds.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Score Progression</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No rounds played yet. Start adding scores to see the chart!</p>
        </div>
      </div>
    );
  }

  // Generate colors for each player
  const colors = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#F97316', // orange
    '#EC4899', // pink
    '#06B6D4', // cyan
  ];

  // Build chart data with cumulative scores
  const chartData = game.rounds.map((round, roundIndex) => {
    const roundData: any = {
      round: roundIndex + 1,
    };

    // Calculate cumulative scores for each player up to this round
    game.players.forEach((player, playerIndex) => {
      let cumulativeScore = 0;
      for (let i = 0; i <= roundIndex; i++) {
        cumulativeScore += game.rounds[i].scores[player.id] || 0;
      }
      roundData[player.name] = cumulativeScore;
    });

    return roundData;
  });

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Score Progression</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="round" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {game.players.map((player, index) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.name}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Target score indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Target Score:</span>
          <span className="font-semibold text-gray-800">{game.targetScore} points</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;