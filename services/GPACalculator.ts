/**
 * GPACalculator - Service for GPA calculations
 * Single responsibility: Calculate weighted and unweighted GPAs
 */

import { Course, CourseLevel } from "@/lib/types";

export class GPACalculator {

    /**
     * Convert 0-100 grade to 4.0 scale using standard conversion
     */
    private static getBaseGPA(grade: number): number {
        if (grade >= 93) return 4.0;
        if (grade >= 90) return 3.7;
        if (grade >= 87) return 3.3;
        if (grade >= 83) return 3.0;
        if (grade >= 80) return 2.7;
        if (grade >= 77) return 2.3;
        if (grade >= 73) return 2.0;
        if (grade >= 70) return 1.7;
        if (grade >= 67) return 1.3;
        if (grade >= 65) return 1.0;
        return 0.0;
    }

    /**
     * Get add-on weight based on course level
     * AP/IB: +1.0, Honors/Dual Enrollment: +0.5, Regular: +0.0
     */
    private static getWeightAddon(level: CourseLevel): number {
        switch (level) {
            case CourseLevel.AP:
            case CourseLevel.IB:
                return 1.0;
            case CourseLevel.Honors:
            case CourseLevel.DualEnrollment:
                return 0.5;
            case CourseLevel.Regular:
            default:
                return 0.0;
        }
    }

    /**
     * Calculate unweighted GPA (4.0 scale)
     */
    static calculateUnweightedGPA(courses: Course[]): number {
        const gradedCourses = courses.filter(c => c.grade !== null);
        if (gradedCourses.length === 0) return 0;

        const totalPoints = gradedCourses.reduce((sum, course) => {
            return sum + this.getBaseGPA(course.grade!);
        }, 0);

        return Number((totalPoints / gradedCourses.length).toFixed(2));
    }

    /**
     * Calculate weighted GPA (5.0 scale for AP/IB)
     */
    static calculateWeightedGPA(courses: Course[]): number {
        const gradedCourses = courses.filter(c => c.grade !== null);
        if (gradedCourses.length === 0) return 0;

        const totalPoints = gradedCourses.reduce((sum, course) => {
            const base = this.getBaseGPA(course.grade!);
            const weight = this.getWeightAddon(course.level);
            // Cap at 5.0 and only apply weight if student passed
            const finalPoints = base > 0 ? Math.min(base + weight, 5.0) : 0;
            return sum + finalPoints;
        }, 0);

        return Number((totalPoints / gradedCourses.length).toFixed(2));
    }

    /**
     * Get GPA trend by year (weighted)
     */
    static getGPAByYear(courses: Course[]): { year: number; gpa: number }[] {
        const coursesByYear = courses.reduce((acc, course) => {
            if (!acc[course.year]) acc[course.year] = [];
            acc[course.year].push(course);
            return acc;
        }, {} as Record<number, Course[]>);

        return Object.entries(coursesByYear)
            .map(([year, yearCourses]) => ({
                year: parseInt(year),
                gpa: this.calculateWeightedGPA(yearCourses),
            }))
            .sort((a, b) => a.year - b.year);
    }
}
