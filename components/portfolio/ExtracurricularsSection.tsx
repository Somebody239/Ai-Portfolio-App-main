import React from "react";
import { PortfolioCard, SectionHeader } from "./PortfolioAtoms";
import { Extracurricular } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { Trophy } from "lucide-react";

interface ExtracurricularsSectionProps {
  items: Extracurricular[];
  onAdd: () => void;
  onEdit?: (item: Extracurricular) => void;
  onDelete?: (id: string) => void;
}

export const ExtracurricularsSection = ({ items, onAdd, onEdit, onDelete }: ExtracurricularsSectionProps) => {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Extracurriculars & Projects"
        description="Clubs, hobbies, community service, and personal projects."
        onAdd={onAdd}
      />

      <div className="grid grid-cols-1 gap-3">
        {items.length === 0 ? (
          <EmptyState
            icon={<Trophy size={32} />}
            title="No activities added yet"
            description="Show universities what you do outside of class."
          />
        ) : (
          items.map((item) => (
            <PortfolioCard
              key={item.id}
              title={item.title}
              subtitle={item.description || undefined}
              metaLeft={`${item.hours_per_week} hrs/wk`}
              metaRight={`${item.years_participated} yrs`}
              tags={[item.level]}
              onEdit={onEdit ? () => onEdit(item) : undefined}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
            />
          ))
        )}
      </div>
    </section>
  );
};

