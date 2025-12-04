/**
 * ExtracurricularsManager - Business logic for extracurricular activities
 * Single responsibility: Manage CRUD operations and validation for extracurriculars
 */

import { ExtracurricularsRepository } from "@/lib/supabase/repositories/extracurriculars.repository";
import { Extracurricular } from "@/lib/types";

export interface ExtracurricularFormData {
  title: string;
  description?: string;
  level: string;
  hours_per_week: number;
  years_participated: number;
}

export class ExtracurricularsManager {
  private repository: ExtracurricularsRepository;

  constructor() {
    this.repository = new ExtracurricularsRepository();
  }

  async create(userId: string, data: ExtracurricularFormData): Promise<Extracurricular> {
    this.validateFormData(data);

    return await this.repository.create({
      user_id: userId,
      name: data.title, // Map title to name for interface compatibility
      title: data.title,
      description: data.description || null,
      level: data.level,
      hours_per_week: data.hours_per_week,
      years_participated: data.years_participated,
    });
  }

  async update(id: string, data: Partial<ExtracurricularFormData>): Promise<Extracurricular> {
    if (data.title || data.hours_per_week !== undefined || data.years_participated !== undefined) {
      this.validateFormData(data as ExtracurricularFormData);
    }

    return await this.repository.update(id, {
      title: data.title,
      description: data.description,
      level: data.level,
      hours_per_week: data.hours_per_week,
      years_participated: data.years_participated,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<Extracurricular[]> {
    return await this.repository.getByUserId(userId);
  }

  private validateFormData(data: Partial<ExtracurricularFormData>): void {
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (data.hours_per_week !== undefined && data.hours_per_week < 0) {
      throw new Error("Hours per week must be positive");
    }

    if (data.years_participated !== undefined && data.years_participated < 0) {
      throw new Error("Years participated must be positive");
    }

    if (data.hours_per_week !== undefined && data.hours_per_week > 168) {
      throw new Error("Hours per week cannot exceed 168");
    }
  }

  getLevelOptions(): Array<{ value: string; label: string }> {
    return [
      { value: "School", label: "School" },
      { value: "Local", label: "Local" },
      { value: "State", label: "State" },
      { value: "National", label: "National" },
      { value: "International", label: "International" },
      { value: "Community", label: "Community" },
    ];
  }
}
