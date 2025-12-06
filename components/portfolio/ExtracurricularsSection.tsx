import React, { useState } from "react";
import { PortfolioCard, SectionHeader } from "./PortfolioAtoms";
import { Extracurricular } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ExtracurricularInlineForm, ExtracurricularFormData } from "./ExtracurricularInlineForm";
import { ExpandableCard } from "@/components/common/ExpandableCard";

interface ExtracurricularsSectionProps {
  items: Extracurricular[];
  onAdd: () => void; // Keep for backward compatibility or strict modal usage if preferred
  onAddInline?: (data: ExtracurricularFormData) => Promise<void>;
  onUpdateInline?: (id: string, data: ExtracurricularFormData) => Promise<void>;
  onEdit?: (item: Extracurricular) => void;
  onDelete?: (id: string) => void;
}

export const ExtracurricularsSection = ({
  items,
  onAdd,
  onAddInline,
  onUpdateInline,
  onEdit,
  onDelete
}: ExtracurricularsSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddClick = () => {
    if (onAddInline) setIsAdding(true);
    else onAdd();
  };

  const handleEditClick = (item: Extracurricular) => {
    if (onUpdateInline) setEditingId(item.id);
    else if (onEdit) onEdit(item);
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Extracurriculars & Projects"
        description="Clubs, hobbies, community service, and personal projects."
        onAdd={!isAdding ? handleAddClick : undefined}
      />

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {isAdding && onAddInline && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <ExtracurricularInlineForm
                onSave={async (data) => {
                  await onAddInline(data);
                  setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
              />
            </motion.div>
          )}

          {items.length === 0 && !isAdding ? (
            <motion.div>
              <EmptyState
                icon={<Trophy size={32} className="text-zinc-600" />}
                title="No activities added yet"
                description="Show universities what you do outside of class."
              />
            </motion.div>
          ) : (
            items.map((item) => (
              <AnimatePresence key={item.id} mode="wait">
                {editingId === item.id && onUpdateInline ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <ExtracurricularInlineForm
                      initialData={item}
                      onSave={async (data) => {
                        await onUpdateInline(item.id, data);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="card"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PortfolioCard
                      title={item.title}
                      subtitle={item.description || undefined}
                      metaLeft={`${item.hours_per_week} hrs/wk`}
                      metaRight={`${item.years_participated} yrs`}
                      tags={[item.level]}
                      onEdit={() => handleEditClick(item)}
                      onDelete={onDelete ? () => onDelete(item.id) : undefined}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

