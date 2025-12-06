import React from "react";
import { PortfolioCard, SectionHeader } from "./PortfolioAtoms";
import { Achievement } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { Trophy } from "lucide-react";

import { AchievementInlineForm } from "./AchievementInlineForm";
import { AnimatePresence, motion } from "framer-motion";

interface AchievementsSectionProps {
  items: Achievement[];
  onAdd: () => void; // Keep for fallback or re-purpose
  onAddInline?: (data: any) => Promise<void>;
  onUpdateInline?: (id: string, data: any) => Promise<void>;
  onEdit?: (item: Achievement) => void;
  onDelete?: (id: string) => void;
}

export const AchievementsSection = ({ items, onAdd, onAddInline, onUpdateInline, onEdit, onDelete }: AchievementsSectionProps) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Honors & Awards"
        description="Academic distinctions and competitive awards."
        onAdd={onAddInline ? () => setIsAdding(true) : onAdd}
      />

      <AnimatePresence>
        {isAdding && onAddInline && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <AchievementInlineForm
              onSave={async (data) => {
                await onAddInline(data);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <EmptyState
          icon={<Trophy size={32} />}
          title="No honors logged yet"
          description="Add your best achievements so colleges can see your impact."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            editingId === item.id && onUpdateInline ? (
              <div key={item.id} className="col-span-1 md:col-span-2">
                <AchievementInlineForm
                  initialData={item}
                  onSave={async (data) => {
                    await onUpdateInline(item.id, data);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <PortfolioCard
                key={item.id}
                title={item.title}
                subtitle={item.awarded_by || undefined}
                metaRight={item.date_awarded ? new Date(item.date_awarded).getFullYear().toString() : "N/A"}
                tags={item.category ? [item.category] : ["Award"]}
                onEdit={() => {
                  if (onUpdateInline) setEditingId(item.id);
                  else if (onEdit) onEdit(item);
                }}
                onDelete={onDelete ? () => onDelete(item.id) : undefined}
              >
                <div className="absolute top-4 right-4 text-emerald-500/10 group-hover:text-amber-300/20 transition-colors pointer-events-none">
                  <Trophy size={40} />
                </div>
              </PortfolioCard>
            )
          ))}
        </div>
      )}
    </section>
  );
};

