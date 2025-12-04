import { Course } from '@/lib/types';

export interface YearStats {
    gpa: number;
    credits: number;
    courseCount: number;
}

export class CourseTimelineViewModel {
    /**
     * Group courses by year (e.g., 9, 10, 11, 12)
     */
    static groupCoursesByYear(courses: Course[]): Map<number, Course[]> {
        const grouped = new Map<number, Course[]>();

        // Initialize for standard high school years
        [9, 10, 11, 12].forEach(year => grouped.set(year, []));

        courses.forEach(course => {
            const year = course.year;
            if (!grouped.has(year)) {
                grouped.set(year, []);
            }
            grouped.get(year)?.push(course);
        });

        // Sort courses within each year by semester (Fall -> Spring -> Summer -> Winter)
        const semesterOrder: Record<string, number> = {
            'Fall': 1, 'Spring': 2, 'Summer': 3, 'Winter': 4
        };

        grouped.forEach((yearCourses) => {
            yearCourses.sort((a, b) => {
                const semA = semesterOrder[a.semester] || 99;
                const semB = semesterOrder[b.semester] || 99;
                return semA - semB;
            });
        });

        return grouped;
    }

    /**
     * Calculate GPA for a specific set of courses
     * Assumes 4.0 scale for now, can be adjusted based on grading scale
     */
    static calculateYearGPA(courses: Course[]): number {
        const gradedCourses = courses.filter(c => c.grade !== null);
        if (gradedCourses.length === 0) return 0;

        let totalPoints = 0;
        let count = 0;

        gradedCourses.forEach(course => {
            // Simple conversion logic - can be made more complex if needed
            // Assuming grade is 0-100
            let points = 0;
            const grade = course.grade!;

            if (grade >= 93) points = 4.0;
            else if (grade >= 90) points = 3.7;
            else if (grade >= 87) points = 3.3;
            else if (grade >= 83) points = 3.0;
            else if (grade >= 80) points = 2.7;
            else if (grade >= 77) points = 2.3;
            else if (grade >= 73) points = 2.0;
            else if (grade >= 70) points = 1.7;
            else if (grade >= 67) points = 1.3;
            else if (grade >= 65) points = 1.0;
            else points = 0.0;

            // Weighted GPA logic
            if (course.level === 'AP' || course.level === 'IB') {
                points += 1.0;
            } else if (course.level === 'Honors') {
                points += 0.5;
            }

            totalPoints += points;
            count++;
        });

        return count === 0 ? 0 : Number((totalPoints / count).toFixed(2));
    }

    /**
     * Calculate total credits for a year
     * Assuming each course is 1 credit for now
     */
    static calculateYearCredits(courses: Course[]): number {
        return courses.length; // Placeholder: replace with actual credit field if available
    }

    /**
     * Get comprehensive stats for a year
     */
    static getYearStats(courses: Course[]): YearStats {
        return {
            gpa: this.calculateYearGPA(courses),
            credits: this.calculateYearCredits(courses),
            courseCount: courses.length
        };
    }
}
