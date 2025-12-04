/**
 * CourseGradesViewModel - Grade calculation logic
 * Single responsibility: Calculate and manage course grades from assignments
 */

import { Assignment, AssignmentType, CourseLevel } from "@/lib/types";

export interface WeightConfig {
    [key: string]: number; // AssignmentType -> weight percentage
}

export interface GradeBreakdown {
    categoryGrades: Map<AssignmentType, {
        earned: number;
        total: number;
        percentage: number;
        weight: number;
        weightedScore: number;
    }>;
    calculatedGrade: number;
    totalWeightUsed: number;
    missingWeight: number;
}

export class CourseGradesViewModel {
    /**
     * Calculate overall grade from assignments
     * Uses weighted average based on assignment types
     */
    static calculateGrade(assignments: Assignment[], weightConfig?: WeightConfig): GradeBreakdown {
        // Group assignments by type
        const assignmentsByType = new Map<AssignmentType, Assignment[]>();

        assignments.forEach(assignment => {
            if (!assignmentsByType.has(assignment.assignment_type)) {
                assignmentsByType.set(assignment.assignment_type, []);
            }
            assignmentsByType.get(assignment.assignment_type)!.push(assignment);
        });

        // Calculate grade for each category
        const categoryGrades = new Map<AssignmentType, {
            earned: number;
            total: number;
            percentage: number;
            weight: number;
            weightedScore: number;
        }>();

        let totalWeightedScore = 0;
        let totalWeightUsed = 0;

        assignmentsByType.forEach((typeAssignments, type) => {
            // Only include graded assignments
            const gradedAssignments = typeAssignments.filter(a =>
                a.earned_points !== null && a.earned_points !== undefined
            );

            if (gradedAssignments.length === 0) return;

            // Sum up points
            const earnedPoints = gradedAssignments.reduce((sum, a) => sum + (a.earned_points || 0), 0);
            const totalPoints = gradedAssignments.reduce((sum, a) => sum + a.total_points, 0);
            const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

            // Use custom weight or average weight from assignments
            const weight = weightConfig?.[type] ||
                (gradedAssignments.reduce((sum, a) => sum + a.weight_percentage, 0) / gradedAssignments.length);

            const weightedScore = (percentage * weight) / 100;

            categoryGrades.set(type, {
                earned: earnedPoints,
                total: totalPoints,
                percentage,
                weight,
                weightedScore,
            });

            totalWeightedScore += weightedScore;
            totalWeightUsed += weight;
        });

        // Calculate final grade (normalize if total weight < 100)
        const calculatedGrade = totalWeightUsed > 0
            ? (totalWeightedScore / totalWeightUsed) * 100
            : 0;

        return {
            categoryGrades,
            calculatedGrade: Math.min(100, Math.max(0, calculatedGrade)),
            totalWeightUsed,
            missingWeight: Math.max(0, 100 - totalWeightUsed),
        };
    }

    /**
     * Apply course level boost (AP/Honors)
     * AP: +5%, Honors/Dual Enrollment: +2.5%
     */
    static applyLevelBoost(grade: number, level: CourseLevel): number {
        let boostedGrade = grade;

        switch (level) {
            case CourseLevel.AP:
                boostedGrade = grade + 5;
                break;
            case CourseLevel.Honors:
            case CourseLevel.DualEnrollment:
                boostedGrade = grade + 2.5;
                break;
            default:
                // No boost for Regular or IB
                break;
        }

        // Cap at 100
        return Math.min(100, boostedGrade);
    }

    /**
     * Get suggested weights for assignment types
     */
    static getSuggestedWeights(): WeightConfig {
        return {
            [AssignmentType.FinalExam]: 25,
            [AssignmentType.Midterm]: 20,
            [AssignmentType.Test]: 30,
            [AssignmentType.Quiz]: 10,
            [AssignmentType.Homework]: 10,
            [AssignmentType.Project]: 15,
            [AssignmentType.Lab]: 10,
            [AssignmentType.Participation]: 5,
            [AssignmentType.Other]: 5,
        };
    }

    /**
     * Format grade as letter grade
     */
    static getLetterGrade(percentage: number): string {
        if (percentage >= 93) return "A";
        if (percentage >= 90) return "A-";
        if (percentage >= 87) return "B+";
        if (percentage >= 83) return "B";
        if (percentage >= 80) return "B-";
        if (percentage >= 77) return "C+";
        if (percentage >= 73) return "C";
        if (percentage >= 70) return "C-";
        if (percentage >= 67) return "D+";
        if (percentage >= 65) return "D";
        return "F";
    }
}
