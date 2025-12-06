import React from 'react';
import { Target, BookOpen, Award, Calendar } from 'lucide-react';
import { TimelineEvent } from '@/viewmodels/DashboardViewModel';

interface RecentEventsTimelineProps {
  events?: TimelineEvent[];
}

export const RecentEventsTimeline: React.FC<RecentEventsTimelineProps> = ({ events = [] }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target': return Target;
      case 'BookOpen': return BookOpen;
      case 'Award': return Award;
      default: return Calendar;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Timeline</h3>
          <p className="text-xs text-zinc-500">Recent activity</p>
        </div>
      </div>

      <div className="flex-1">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <Calendar size={32} className="mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const Icon = typeof event.icon === 'string' ? getIcon(event.icon) : event.icon;
              return (
                <div key={event.id} className="flex items-start gap-3 group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${event.color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-zinc-500">{event.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
