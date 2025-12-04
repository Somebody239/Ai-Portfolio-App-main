/**
 * CoursesManager - Business logic for courses
 * Single responsibility: Manage CRUD operations and validation for courses
 */

import { CoursesRepository } from "@/lib/supabase/repositories/courses.repository";
import { Course, CourseTerm, CourseLevel } from "@/lib/types";

export interface CourseFormData {
  name: string;
  year: number;
  semester: CourseTerm;
  level: CourseLevel;
}

export class CoursesManager {
  private repository: CoursesRepository;

  constructor() {
    this.repository = new CoursesRepository();
  }

  async create(userId: string, data: CourseFormData): Promise<Course> {
    this.validateFormData(data);

    return await this.repository.create({
      user_id: userId,
      name: data.name,
      grade: null, // Grade will be calculated from assignments
      level: data.level,
      year: data.year,
      semester: data.semester,
    });
  }

  async update(id: string, data: Partial<CourseFormData>): Promise<Course> {
    if (data.name) {
      this.validateFormData(data as CourseFormData);
    }

    return await this.repository.update(id, {
      name: data.name,
      level: data.level,
      year: data.year,
      semester: data.semester,
    });
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getByUserId(userId: string): Promise<Course[]> {
    return await this.repository.getByUserId(userId);
  }

  async getById(id: string): Promise<Course | null> {
    return await this.repository.getById(id);
  }

  private validateFormData(data: Partial<CourseFormData>): void {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error("Course name is required");
    }

    if (data.year !== undefined) {
      // Allow Grade 9-12
      if (data.year < 9 || data.year > 12) {
        // Also allow calendar years for legacy support if needed, but primarily we want 9-12
        const currentYear = new Date().getFullYear();
        if (data.year < 1900 || data.year > currentYear + 10) {
          throw new Error("Invalid grade level. Please select 9, 10, 11, or 12.");
        }
      }
    }
  }

  getSemesterOptions(): Array<{ value: string; label: string }> {
    return [
      { value: CourseTerm.Fall, label: "Fall" },
      { value: CourseTerm.Spring, label: "Spring" },
      { value: CourseTerm.Summer, label: "Summer" },
      { value: CourseTerm.Winter, label: "Winter" },
    ];
  }

  getYearOptions(): Array<{ value: string; label: string }> {
    return [
      { value: "9", label: "Grade 9" },
      { value: "10", label: "Grade 10" },
      { value: "11", label: "Grade 11" },
      { value: "12", label: "Grade 12" },
    ];
  }
}
