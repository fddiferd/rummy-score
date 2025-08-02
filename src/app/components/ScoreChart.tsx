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
    <div className="bg-white shadow-lg lg:rounded-xl p-4 md:p-6 mb-6 border-0 lg:border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Score Progression</h3>
      <div className="h-64 md:h-80">
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
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  // Sort payload by value in descending order
                  const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));
                  
                  return (
                    <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 shadow-2xl min-w-[160px]">
                      <p className="font-bold text-gray-800 mb-3 text-center border-b border-gray-100 pb-2 text-lg">
                        Round {label}
                      </p>
                      <div className="space-y-2">
                        {sortedPayload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full shadow-sm border-2 border-white" 
                                style={{ backgroundColor: entry.color }}
                              ></div>
                              <span className="font-medium text-gray-700 text-sm">{entry.dataKey}</span>
                              {index === 0 && (
                                <span className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-semibold border border-yellow-300 shadow-sm">
                                  🏆 Leading
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-gray-900 text-lg min-w-[40px] text-right">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
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