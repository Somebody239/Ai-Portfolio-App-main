/**
 * TestScoresManager - Business logic for standardized test scores
 * Single responsibility: Manage CRUD operations and validation for test scores
 */

import { ScoresRepository } from "@/lib/supabase/repositories/scores.repository";
import { StandardizedScore, TestType } from "@/lib/types";

export interface TestScoreFormData {
  test_type: TestType;
  score: number;
  section_scores?: Record<string, number>;
  date_taken?: string;
}

export class TestScoresManager {
  private repository: ScoresRepository;

  constructor() {
    this.repository = new ScoresRepository();
  }

  async create(userId: string, data: TestScoreFormData): Promise<StandardizedScore> {
    this.validateFormData(data);

    return await this.repository.create({
      user_id: userId,
      test_type: data.test_type,
      score: data.score,
      section_scores: data.section_scores || undefined,
      date_taken: data.date_taken || null,
    });
  }

  async update(id: string, data: Partial<TestScoreFormData>): Promise<StandardizedScore> {
    if (data.test_type && data.score !== undefined) {
      this.validateFormData(data as TestScoreFormData);
    }

    return await this.repository.update(id, {
      test_type: data.test_type,
      score: data.score,
      section_scores: data.section_scores,
      date_taken: data.date_taken,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<StandardizedScore[]> {
    return await this.repository.getByUserId(userId);
  }

  private validateFormData(data: TestScoreFormData): void {
    if (!data.test_type) {
      throw new Error("Test type is required");
    }

    if (data.score === undefined || data.score === null) {
      throw new Error("Score is required");
    }

    const { min, max } = this.getScoreRange(data.test_type);
    if (data.score < min || data.score > max) {
      throw new Error(`Score must be between ${min} and ${max} for ${data.test_type}`);
    }

    if (data.date_taken && !this.isValidDate(data.date_taken)) {
      throw new Error("Invalid date format");
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  getScoreRange(testType: TestType): { min: number; max: number } {
    const ranges: Record<TestType, { min: number; max: number }> = {
      [TestType.SAT]: { min: 400, max: 1600 },
      [TestType.ACT]: { min: 1, max: 36 },
      [TestType.AP]: { min: 1, max: 5 },
      [TestType.IB]: { min: 1, max: 7 },
      [TestType.TOEFL]: { min: 0, max: 120 },
      [TestType.IELTS]: { min: 0, max: 9 },
      [TestType.OTHER]: { min: 0, max: 1000 },
    };

    return ranges[testType];
  }

  getTestTypeOptions(): Array<{ value: string; label: string }> {
    return [
      { value: TestType.SAT, label: "SAT" },
      { value: TestType.ACT, label: "ACT" },
      { value: TestType.AP, label: "AP" },
      { value: TestType.IB, label: "IB" },
      { value: TestType.TOEFL, label: "TOEFL" },
      { value: TestType.IELTS, label: "IELTS" },
      { value: TestType.OTHER, label: "Other" },
    ];
  }
}
