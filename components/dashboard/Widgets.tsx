import React, { memo } from "react";
import { AlertCircle, X } from "lucide-react";
import { Card } from "@/components/ui/Atoms";
import { University, AIRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
}

export const StatWidget = memo<StatWidgetProps>(({ label, value, icon, subtext }) => (
  <Card className="flex flex-col justify-between py-5 px-6 space-y-4 hover:border-zinc-700 transition-colors bg-zinc-900/50 border-zinc-800/60">
    <div className="flex justify-between items-start w-full">
      <div className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 border border-zinc-800 shadow-sm">
        {icon}
      </div>
      {subtext && <span className="text-xs text-zinc-500 font-medium bg-zinc-900/50 px-2 py-1 rounded-full border border-zinc-800/50">{subtext}</span>}
    </div>
    <div>
      <h3
        className={cn(
          "font-bold text-zinc-100 tracking-tight leading-none",
          String(value).length > 6 ? "text-2xl" : "text-3xl"
        )}
      >
        {value}
      </h3>
      <p className="text-sm text-zinc-500 font-medium mt-1.5">{label}</p>
    </div>
  </Card>
));

StatWidget.displayName = "StatWidget";


interface UniversityRowProps {
  university: University & { risk?: "Safety" | "Target" | "Reach" | "High Reach" };
  onRemove: (id: number) => void;
  onClick?: (university: University) => void;
}

export function UniversityRow({ university, onRemove, onClick }: UniversityRowProps) {
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "Safety":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Target":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "Reach":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "High Reach":
        return "bg-amber-600/10 text-amber-500 border-amber-600/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  const getAcceptanceRateColor = (rate: number | null | undefined) => {
    if (!rate) return "text-zinc-500";
    if (rate < 0.15) return "text-amber-500 font-medium"; // Hard -> Amber
    if (rate < 0.30) return "text-amber-400 font-medium"; // Medium -> Amber
    return "text-emerald-400 font-medium"; // Easy -> Emerald
  };

  return (
    <div
      onClick={() => onClick?.(university)}
      className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl group hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        {university.image_url ? (
          <img
            src={university.image_url}
            alt={university.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-zinc-800"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-lg border border-zinc-700">
            {university.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
            {university.name}
          </h3>
          <div className="flex items-center text-xs text-zinc-500 mt-1 space-x-2">
            <span>{university.city}, {university.state}</span>
            <span>•</span>
            <span className={getAcceptanceRateColor(university.acceptance_rate)}>
              {university.acceptance_rate ? `${(university.acceptance_rate * 100).toFixed(1)}% Acc.` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {university.risk && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRiskColor(
              university.risk
            )}`}
          >
            {university.risk}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(university.id);
          }}
          className="text-zinc-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
          title="Remove from target list"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}


interface RecommendationCardProps {
  rec: AIRecommendation;
}

export const RecommendationCard = memo<RecommendationCardProps>(({ rec }) => (
  <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg mb-3">
    <div className="flex gap-3">
      <AlertCircle className="w-5 h-5 text-zinc-100 shrink-0 mt-0.5" />
      <div>
        <h5 className="text-sm font-semibold text-zinc-200 mb-1">AI Recommendation</h5>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {typeof rec.output_data === 'string' ? rec.output_data : JSON.stringify(rec.output_data)}
        </p>
        <p className="text-xs text-zinc-600 mt-2 font-mono uppercase">Type: {rec.feature_type}</p>
      </div>
    </div>
  </div>
));

RecommendationCard.displayName = "RecommendationCard";
