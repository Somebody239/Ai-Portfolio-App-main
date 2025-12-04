import { ReactNode } from "react";

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <div className="mb-4 text-zinc-600 p-3 bg-zinc-900/50 rounded-full">{icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}
