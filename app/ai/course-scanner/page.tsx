'use client';

import { CourseScanner } from '@/components/ai/CourseScanner';

export default function CourseScannerPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <CourseScanner
                onCoursesAdded={(count) => {
                    console.log(`Successfully added ${count} courses`);
                }}
            />
        </div>
    );
}
