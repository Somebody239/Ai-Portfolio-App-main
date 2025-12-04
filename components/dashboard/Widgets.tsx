import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/Atoms";
import { University, AIRecommendation } from "@/lib/types";

interface StatWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
}

export const StatWidget = memo<StatWidgetProps>(({ label, value, icon, subtext }) => (
  <Card className="flex flex-col justify-between min-h-[140px]">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-zinc-800">
        {icon}
      </div>
      {subtext && <span className="text-xs text-zinc-500 font-mono">{subtext}</span>}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-zinc-100 tracking-tight">{value}</h3>
      <p className="text-sm text-zinc-500 font-medium mt-1">{label}</p>
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
        return "bg-green-100 text-green-800";
      case "Target":
        return "bg-blue-100 text-blue-800";
      case "Reach":
        return "bg-yellow-100 text-yellow-800";
      case "High Reach":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAcceptanceRateColor = (rate: number | null | undefined) => {
    if (!rate) return "text-gray-500";
    if (rate < 0.15) return "text-red-600 font-medium";
    if (rate < 0.30) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  return (
    <div
      onClick={() => onClick?.(university)}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        {university.image_url ? (
          <img
            src={university.image_url}
            alt={university.name}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-200">
            {university.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {university.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
            <span>{university.city}, {university.state}</span>
            <span>•</span>
            <span className={getAcceptanceRateColor(university.acceptance_rate)}>
              {university.acceptance_rate ? `${(university.acceptance_rate * 100).toFixed(1)}% Acceptance` : 'N/A'}
            </span>
            {university.avg_sat && (
              <>
                <span>•</span>
                <span>Avg SAT: {university.avg_sat}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {university.risk && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
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
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
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


