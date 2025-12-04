import React from 'react';
import { Calendar } from 'lucide-react';

export const RecentEventsTimeline: React.FC = () => {
  // TODO: Connect to real events from database (course deadlines, university app deadlines, etc.)
  const events: any[] = []; // Empty until we have real data

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Timeline</h3>
          <p className="text-xs text-zinc-500">Recent & upcoming</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={32} className="mx-auto mb-2 text-zinc-700" />
            <p className="text-sm text-zinc-500">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event: any) => (
              <div key={event.id} className="flex items-start gap-3 group cursor-pointer">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${event.color}`}>
                  <event.icon size={14} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-medium text-white truncate group-hover:text-[#FF6B35] transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-zinc-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
