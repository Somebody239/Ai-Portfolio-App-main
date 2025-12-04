/**
 * AchievementsManager - Business logic for achievements
 * Single responsibility: Manage CRUD operations and validation for achievements
 */

import { AchievementsRepository } from "@/lib/supabase/repositories/achievements.repository";
import { Achievement } from "@/lib/types";

export interface AchievementFormData {
  title: string;
  description?: string;
  category?: string;
  awarded_by?: string;
  date_awarded?: string;
}

export class AchievementsManager {
  private repository: AchievementsRepository;

  constructor() {
    this.repository = new AchievementsRepository();
  }

  async create(userId: string, data: AchievementFormData): Promise<Achievement> {
    this.validateFormData(data);

    return await this.repository.create({
      user_id: userId,
      title: data.title,
      description: data.description || null,
      category: data.category || null,
      awarded_by: data.awarded_by || null,
      date_awarded: data.date_awarded || null,
    });
  }

  async update(id: string, data: Partial<AchievementFormData>): Promise<Achievement> {
    if (data.title) {
      this.validateFormData(data as AchievementFormData);
    }

    return await this.repository.update(id, {
      title: data.title,
      description: data.description,
      category: data.category,
      awarded_by: data.awarded_by,
      date_awarded: data.date_awarded,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<Achievement[]> {
    return await this.repository.getByUserId(userId);
  }

  private validateFormData(data: Partial<AchievementFormData>): void {
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (data.date_awarded && !this.isValidDate(data.date_awarded)) {
      throw new Error("Invalid date format");
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  getCategoryOptions(): Array<{ value: string; label: string }> {
    return [
      { value: "Academic", label: "Academic" },
      { value: "Athletic", label: "Athletic" },
      { value: "Arts", label: "Arts" },
      { value: "Leadership", label: "Leadership" },
      { value: "Community Service", label: "Community Service" },
      { value: "Competition", label: "Competition" },
      { value: "Research", label: "Research" },
      { value: "Other", label: "Other" },
    ];
  }
}
