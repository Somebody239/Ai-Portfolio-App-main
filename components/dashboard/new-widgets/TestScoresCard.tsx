import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TestScoresCardProps {
  satScore: number | null;
  actScore: number | null;
  className?: string;
}

export const TestScoresCard: React.FC<TestScoresCardProps> = ({
  satScore,
  actScore,
  className
}) => {
  const router = useRouter();

  return (
    <div className={cn("bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col group relative overflow-hidden", className)}>

      {/* Background Gradient for "Premium" feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-white">Test Scores</h3>
          <p className="text-xs text-zinc-500">Standardized tests</p>
        </div>
        <button
          onClick={() => router.push('/academics')}
          className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-8 relative z-10">
        <div className="text-center group/sat cursor-pointer" onClick={() => router.push('/academics')}>
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-medium">SAT</p>
          <div className="text-4xl font-bold text-white group-hover/sat:text-emerald-400 transition-colors">
            {satScore || '—'}
          </div>
        </div>

        <div className="w-px h-12 bg-zinc-800/80"></div>

        <div className="text-center group/act cursor-pointer" onClick={() => router.push('/academics')}>
          <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-medium">ACT</p>
          <div className="text-4xl font-bold text-white group-hover/act:text-emerald-400 transition-colors">
            {actScore || '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
