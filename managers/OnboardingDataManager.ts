/**
 * OnboardingDataManager - Handles data persistence for onboarding flow
 * Single responsibility: Save onboarding data to database
 */
import { UsersRepository } from "@/lib/supabase/repositories/users.repository";
import { ScoresRepository } from "@/lib/supabase/repositories/scores.repository";
import { UserTargetsRepository } from "@/lib/supabase/repositories/userTargets.repository";
import { TestType } from "@/lib/types";
import { InputSanitizer } from "@/lib/security/InputSanitizer";
import type { OnboardingDataInput } from "@/lib/validation/Schemas";

export class OnboardingDataManager {
  private usersRepo: UsersRepository;
  private scoresRepo: ScoresRepository;
  private targetsRepo: UserTargetsRepository;

  constructor() {
    this.usersRepo = new UsersRepository();
    this.scoresRepo = new ScoresRepository();
    this.targetsRepo = new UserTargetsRepository();
  }

  /**
   * Saves complete onboarding data for a user
   */
  async saveOnboardingData(
    userId: string,
    userEmail: string | null,
    data: OnboardingDataInput
  ): Promise<void> {
    // Sanitize inputs
    const sanitizedName = InputSanitizer.sanitizeString(data.fullName);
    const sanitizedMajor = InputSanitizer.sanitizeString(data.intendedMajor);
    const gpa = data.currentGpa
      ? InputSanitizer.sanitizeNumber(data.currentGpa, 0, 4.5)
      : null;
    const satScore = data.satScore
      ? InputSanitizer.sanitizeNumber(data.satScore, 400, 1600)
      : null;

    // Convert university IDs from strings to numbers
    const universityIds = data.dreamUniversities.map(id => parseInt(id, 10));

    // Validate all university IDs
    if (universityIds.some(id => isNaN(id))) {
      throw new Error("Invalid university ID in selection");
    }

    // Check if user exists
    const existingUser = await this.usersRepo.getById(userId);

    if (existingUser) {
      // Update existing user
      await this.usersRepo.update(userId, {
        name: sanitizedName || null,
        intended_major: sanitizedMajor || null,
        current_gpa: gpa,
      });
    } else {
      // Create new user record
      await this.usersRepo.create({
        id: userId,
        name: sanitizedName || null,
        email: userEmail || null,
        intended_major: sanitizedMajor || null,
        current_gpa: gpa,
      });
    }

    // Save SAT score if provided
    if (satScore !== null) {
      await this.scoresRepo.create({
        user_id: userId,
        test_type: TestType.SAT,
        score: satScore,
      });
    }

    // Create all university targets
    for (const universityId of universityIds) {
      await this.targetsRepo.create(userId, universityId);
    }
  }
}

