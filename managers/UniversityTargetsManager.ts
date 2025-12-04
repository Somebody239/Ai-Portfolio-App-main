/**
 * UniversityTargetsManager - Business logic for university targets
 * Single responsibility: Manage CRUD operations for user's target universities
 */

import { UserTargetsRepository } from "@/lib/supabase/repositories/userTargets.repository";
import { UserTarget } from "@/lib/types";

export interface UniversityTargetFormData {
  university_id: number;
  reason_for_interest?: string;
}

export class UniversityTargetsManager {
  private repository: UserTargetsRepository;

  constructor() {
    this.repository = new UserTargetsRepository();
  }

  async create(
    userId: string,
    data: UniversityTargetFormData
  ): Promise<UserTarget> {
    this.validateFormData(data);

    return await this.repository.create(
      userId,
      data.university_id,
      data.reason_for_interest
    );
  }

  async update(
    id: string,
    data: Partial<UniversityTargetFormData>
  ): Promise<UserTarget> {
    return await this.repository.update(id, {
      reason_for_interest: data.reason_for_interest,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<UserTarget[]> {
    return await this.repository.getByUserId(userId);
  }

  async isAlreadyTargeted(
    userId: string,
    universityId: number
  ): Promise<boolean> {
    const targets = await this.repository.getByUserId(userId);
    return targets.some((target) => target.university_id === universityId);
  }

  private validateFormData(data: UniversityTargetFormData): void {
    if (!data.university_id) {
      throw new Error("University is required");
    }
  }
}
