'use client';

import { CourseScanner } from '@/components/ai/CourseScanner';

export default function CourseScannerPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <CourseScanner
                onCoursesAdded={() => {
                    // Courses added successfully - could add toast notification here
                }}
            />
        </div>
    );
}
