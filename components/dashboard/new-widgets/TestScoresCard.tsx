import React from 'react';
import { Plus } from 'lucide-react';

interface TestScoresCardProps {
  satScore: number | null;
  actScore: number | null;
}

export const TestScoresCard: React.FC<TestScoresCardProps> = ({
  satScore,
  actScore
}) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Test Scores</h3>
          <p className="text-xs text-zinc-500">Standardized tests</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">SAT</p>
          <p className="text-4xl font-bold text-white">{satScore || '—'}</p>
        </div>
        <div className="w-px h-16 bg-zinc-800"></div>
        <div className="text-center">
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">ACT</p>
          <p className="text-4xl font-bold text-white">{actScore || '—'}</p>
        </div>
      </div>
    </div>
  );
};

