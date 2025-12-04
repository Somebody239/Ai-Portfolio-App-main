'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { extractTextFromImage, isValidImageFile, fileToBase64 } from '@/lib/utils/ocr';
import { AIManager } from '@/managers/AIManager';
import { CoursesRepository } from '@/lib/supabase/repositories/courses.repository';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import type { ExtractedCourse, CourseExtractionResult } from '@/lib/types';
import Image from 'next/image';

interface CourseScannerProps {
    onCoursesAdded?: (count: number) => void;
}

export function CourseScanner({ onCoursesAdded }: CourseScannerProps) {
    const { user } = useUser();
    const coursesRepo = new CoursesRepository();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'ocr' | 'ai' | 'confirm' | 'saving'>('idle');
    const [progress, setProgress] = useState(0);
    const [ocrText, setOcrText] = useState<string>('');
    const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([]);
    const [questions, setQuestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const performAIExtraction = useCallback(async (text: string) => {
        if (!user?.id) {
            setError('You must be logged in to use this feature');
            setStatus('idle');
            return;
        }

        setStatus('ai');
        setProgress(0);

        try {
            const result: CourseExtractionResult = await AIManager.extractCoursesFromText(
                user.id,
                text
            );

            setExtractedCourses(result.courses);
            setQuestions(result.questionsToAskUser || []);
            setProgress(100);
            setStatus('confirm');

            if (result.courses.length === 0) {
                toast.warning('No courses found', {
                    description: 'Please check the image and try again.',
                });
            } else {
                toast.success(`Found ${result.courses.length} course${result.courses.length > 1 ? 's' : ''}`, {
                    description: 'Review and confirm the extracted information.',
                });
            }
        } catch (err) {
            console.error('AI Extraction Error:', err);
            setError('Failed to extract courses. Please try again.');
            setStatus('idle');
        }
    }, [user?.id]);

    const performOCR = useCallback(async (imageFile: File) => {
        setStatus('ocr');
        setProgress(0);

        try {
            const result = await extractTextFromImage(imageFile, (progressInfo) => {
                setProgress(Math.round(progressInfo.progress * 100));
            });

            setOcrText(result.text);
            setProgress(100);

            // Automatically proceed to AI extraction
            performAIExtraction(result.text);
        } catch (err) {
            console.error('OCR Error:', err);
            setError('Failed to extract text from image. Please try a clearer image.');
            setStatus('idle');
        }
    }, [performAIExtraction]);

    const handleFileSelect = useCallback(async (selectedFile: File) => {
        setError(null);

        if (!isValidImageFile(selectedFile)) {
            setError('Please upload a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        setFile(selectedFile);
        setStatus('uploading');

        // Generate preview
        try {
            const base64 = await fileToBase64(selectedFile);
            setPreview(base64);
        } catch (err) {
            console.error('Preview error:', err);
        }

        // Start OCR
        performOCR(selectedFile);
    }, [performOCR]);

    const handleSaveCourses = async () => {
        if (!user?.id) return;

        setStatus('saving');
        let successCount = 0;

        try {
            for (const course of extractedCourses) {
                try {
                    await coursesRepo.create({
                        user_id: user.id,
                        name: course.name,
                        level: course.level,
                        year: course.year,
                        semester: course.semester,
                        credits: course.credits,
                        grade: course.grade,
                    });
                    successCount++;
                } catch (err) {
                    console.error(`Error saving course "${course.name}":`, err);
                }
            }

            toast.success(`Added ${successCount} course${successCount > 1 ? 's' : ''}`, {
                description: 'Your courses have been saved successfully.',
            });

            // Reset state
            setFile(null);
            setPreview(null);
            setExtractedCourses([]);
            setQuestions([]);
            setOcrText('');
            setStatus('idle');
            setProgress(0);

            onCoursesAdded?.(successCount);
        } catch (err) {
            console.error('Save Error:', err);
            setError('Failed to save courses. Please try again.');
            setStatus('confirm');
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setExtractedCourses([]);
        setQuestions([]);
        setOcrText('');
        setStatus('idle');
        setProgress(0);
        setError(null);
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFileSelect(droppedFile);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeCourse = (index: number) => {
        setExtractedCourses((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* File Upload Area */}
            {status === 'idle' && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                >
                    <input
                        type="file"
                        id="course-image"
                        accept="image/*"
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) handleFileSelect(selectedFile);
                        }}
                        className="hidden"
                    />
                    <label htmlFor="course-image" className="cursor-pointer">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">Upload Course Schedule</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop an image or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Supports JPEG, PNG, WebP</p>
                    </label>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Processing States */}
            {(status === 'uploading' || status === 'ocr' || status === 'ai') && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    {preview && (
                        <div className="mb-6 relative h-64">
                            <Image src={preview} alt="Course schedule" fill className="object-contain rounded-lg" />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-sm font-medium">
                                {status === 'ocr' && 'Extracting text from image...'}
                                {status === 'ai' && 'AI is analyzing your courses...'}
                                {status === 'uploading' && 'Processing image...'}
                            </span>
                        </div>

                        {progress > 0 && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation State */}
            {status === 'confirm' && extractedCourses.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Review Extracted Courses</h3>
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            Start Over
                        </button>
                    </div>

                    {/* Questions from AI */}
                    {questions.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                Clarification Needed:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                {questions.map((q, i) => (
                                    <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Courses Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Course Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Level
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Year
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Semester
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Credits
                                    </th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {extractedCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-sm font-medium">{course.name}</td>
                                        <td className="px-4 py-3 text-sm">{course.level}</td>
                                        <td className="px-4 py-3 text-sm">Grade {course.year}</td>
                                        <td className="px-4 py-3 text-sm">{course.semester}</td>
                                        <td className="px-4 py-3 text-sm">{course.credits}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => removeCourse(index)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveCourses}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Save {extractedCourses.length} Course{extractedCourses.length > 1 ? 's' : ''}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Saving State */}
            {status === 'saving' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm font-medium">Saving courses...</span>
                </div>
            )}
        </div>
    );
}
