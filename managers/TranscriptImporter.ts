import { CoursesManager } from "@/managers/CoursesManager";
import { ParsedCourse, ParsedTranscriptData, TranscriptImportResult, Course } from "@/lib/types";

export class TranscriptImporter {
    private coursesManager: CoursesManager;

    constructor() {
        this.coursesManager = new CoursesManager();
    }

    /**
     * Imports parsed courses, detecting and handling duplicates
     */
    async importCourses(
        userId: string,
        parsedData: ParsedTranscriptData
    ): Promise<TranscriptImportResult> {
        const result: TranscriptImportResult = {
            imported: [],
            skipped: [],
            duplicates: [],
            errors: []
        };

        try {
            // Get existing courses to check for duplicates
            const existingCourses = await this.coursesManager.getByUserId(userId);

            for (const parsedCourse of parsedData.courses) {
                try {
                    // Check if course already exists
                    const duplicate = this.findDuplicate(parsedCourse, existingCourses);

                    if (duplicate) {
                        result.duplicates.push(parsedCourse);
                        continue;
                    }

                    // Skip low-confidence courses
                    if (parsedCourse.confidence < 0.5) {
                        result.skipped.push(parsedCourse);
                        result.errors.push(`Skipped "${parsedCourse.name}" due to low confidence (${parsedCourse.confidence.toFixed(2)})`);
                        continue;
                    }

                    // Convert ParsedCourse to Course format
                    const courseData = this.convertToCourseData(parsedCourse);

                    // Create the course
                    const created = await this.coursesManager.create(userId, courseData as any);
                    result.imported.push(created);

                } catch (error) {
                    result.errors.push(`Failed to import "${parsedCourse.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
                    result.skipped.push(parsedCourse);
                }
            }

            return result;
        } catch (error) {
            console.error("Transcript import failed:", error);
            throw error;
        }
    }

    /**
     * Finds duplicate course in existing courses
     * @private
     */
    private findDuplicate(parsedCourse: ParsedCourse, existingCourses: Course[]): Course | null {
        return existingCourses.find(existing => {
            // Match on name and year (allowing slight variations)
            const nameMatch = existing.name.toLowerCase().trim() === parsedCourse.name.toLowerCase().trim();
            const yearMatch = existing.year === parsedCourse.year;

            // If semester info exists, match on that too
            if (existing.semester && parsedCourse.semester) {
                const semesterMatch = existing.semester === parsedCourse.semester;
                return nameMatch && yearMatch && semesterMatch;
            }

            return nameMatch && yearMatch;
        }) || null;
    }

    /**
     * Converts ParsedCourse to Course data format
     * @private
     */
    private convertToCourseData(parsedCourse: ParsedCourse): any {
        return {
            name: parsedCourse.name,
            year: parsedCourse.year,
            semester: parsedCourse.semester,
            grade: parsedCourse.grade,
            credits: parsedCourse.credits || 1.0,
            is_ap: parsedCourse.level === 'AP',
            is_honors: parsedCourse.level === 'Honors',
            // Map other levels if schema supports
        };
    }

    /**
     * Creates courses in batch (optimized for bulk import)
     */
    async importCoursesWithResolution(
        userId: string,
        coursesToImport: ParsedCourse[],
        resolutionMap: Map<string, 'skip' | 'replace' | 'keep'>
    ): Promise<TranscriptImportResult> {
        const result: TranscriptImportResult = {
            imported: [],
            skipped: [],
            duplicates: [],
            errors: []
        };

        for (const course of coursesToImport) {
            const courseKey = `${course.name}-${course.year}-${course.semester}`;
            const resolution = resolutionMap.get(courseKey);

            if (resolution === 'skip') {
                result.skipped.push(course);
                continue;
            }

            if (resolution === 'replace') {
                // TODO: Implement replace logic (delete existing, create new)
                // For now, just create
            }

            try {
                const courseData = this.convertToCourseData(course);
                const created = await this.coursesManager.create(userId, courseData as any);
                result.imported.push(created);
            } catch (error) {
                result.errors.push(`Failed to import "${course.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return result;
    }
}
