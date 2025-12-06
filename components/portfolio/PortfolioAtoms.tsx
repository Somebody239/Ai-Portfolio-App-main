import React from "react";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const SectionHeader = ({
  title,
  description,
  onAdd
}: {
  title: string;
  description?: string;
  onAdd?: () => void
}) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
    </div>
    {onAdd && (
      <button
        onClick={onAdd}
        className="p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-emerald-500/50 rounded-lg text-zinc-400 hover:text-emerald-400 transition-all"
      >
        <Plus size={16} />
      </button>
    )}
  </div>
);

interface PortfolioCardProps {
  title: string;
  subtitle?: string;
  metaLeft?: string;
  metaRight?: string;
  tags?: string[];
  children?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PortfolioCard = ({ title, subtitle, metaLeft, metaRight, tags, children, onEdit, onDelete }: PortfolioCardProps) => {
  return (
    <div className="group relative p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{title}</h4>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button onClick={onEdit} className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="text-zinc-500 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {children}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/50">
        <div className="flex gap-2">
          {tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400/80 bg-emerald-500/5 rounded border border-emerald-500/20">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-zinc-600 font-mono">
          {metaLeft && <span>{metaLeft}</span>}
          {metaRight && <span>{metaRight}</span>}
        </div>
      </div>
    </div>
  );
};

