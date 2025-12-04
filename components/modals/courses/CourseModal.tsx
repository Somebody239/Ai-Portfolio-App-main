"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { FileUpload } from "@/components/base/file-upload/file-upload";
import { extractTextFromImage, isValidImageFile } from '@/lib/utils/ocr';
import { AIManager } from '@/managers/AIManager';
import { toast } from 'sonner';
import type { ExtractedCourse, CourseExtractionResult } from '@/lib/types';
import { Check, X, Loader2, AlertCircle, Scan, PenTool } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CourseForm } from "./CourseForm";
import { CoursesManager, CourseFormData } from "@/managers/CoursesManager";
import { Course } from "@/lib/types";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
  userId: string;
  initialData?: Course;
  mode?: "create" | "edit";
}

export function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  initialData,
  mode = "create",
}: CourseModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "scan">("manual");

  // Manual Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scanner State
  const [file, setFile] = useState<File | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'uploading' | 'ocr' | 'ai' | 'confirm' | 'saving'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);

  const manager = new CoursesManager();
  const formId = "course-form";

  const handleSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result: Course;

      if (mode === "edit" && initialData) {
        result = await manager.update(initialData.id, data);
      } else {
        result = await manager.create(userId, data);
      }

      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scanner Handlers
  const handleFileSelect = async (files: FileList) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setScanError(null);

    if (!isValidImageFile(selectedFile)) {
      setScanError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setFile(selectedFile);
    setScanStatus('uploading');

    // Start OCR
    performOCR(selectedFile);
  };

  const performOCR = async (imageFile: File) => {
    setScanStatus('ocr');
    setScanProgress(0);

    try {
      const result = await extractTextFromImage(imageFile, (progressInfo) => {
        setScanProgress(Math.round(progressInfo.progress * 100));
      });

      setScanProgress(100);
      performAIExtraction(result.text);
    } catch (err) {
      console.error('OCR Error:', err);
      setScanError('Failed to extract text from image. Please try a clearer image.');
      setScanStatus('idle');
      setFile(null);
    }
  };

  const performAIExtraction = async (text: string) => {
    setScanStatus('ai');
    setScanProgress(0);

    try {
      const result: CourseExtractionResult = await AIManager.extractCoursesFromText(
        userId,
        text
      );

      setExtractedCourses(result.courses);
      setQuestions(result.questionsToAskUser || []);
      setScanProgress(100);
      setScanStatus('confirm');

      if (result.courses.length === 0) {
        toast.warning('No courses found', {
          description: 'Please check the image and try again.',
        });
      }
    } catch (err) {
      console.error('AI Extraction Error:', err);
      setScanError('Failed to extract courses. Please try again.');
      setScanStatus('idle');
      setFile(null);
    }
  };

  const handleSaveCourses = async () => {
    setScanStatus('saving');
    let successCount = 0;
    let lastCourse: Course | null = null;

    try {
      for (const course of extractedCourses) {
        try {
          const savedCourse = await manager.create(userId, {
            name: course.name,
            level: course.level,
            year: course.year,
            semester: course.semester,
          });
          lastCourse = savedCourse;
          successCount++;
        } catch (err) {
          console.error(`Error saving course "${course.name}":`, err);
        }
      }

      toast.success(`Added ${successCount} course${successCount > 1 ? 's' : ''}`);

      if (lastCourse) {
        onSuccess(lastCourse); // Trigger refresh
      }

      handleReset();
      onClose();
    } catch (err) {
      console.error('Save Error:', err);
      setScanError('Failed to save courses. Please try again.');
      setScanStatus('confirm');
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedCourses([]);
    setQuestions([]);
    setScanStatus('idle');
    setScanProgress(0);
    setScanError(null);
  };

  const removeCourse = (index: number) => {
    setExtractedCourses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your course details."
              : "Add a new course manually or scan your transcript."}
          </DialogDescription>
        </DialogHeader>

        {mode === "edit" ? (
          <div className="space-y-4">
            <CourseForm
              formId={formId}
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form={formId}
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Tabs defaultValue="manual" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 mb-6">
              <TabsTrigger value="manual" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <PenTool className="w-4 h-4 mr-2" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="scan" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <Scan className="w-4 h-4 mr-2" />
                Scan Transcript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-0">
              <CourseForm
                formId={formId}
                initialData={initialData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              {error && <p className="text-sm text-rose-400 mt-4">{error}</p>}
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form={formId}
                  isLoading={isSubmitting}
                >
                  Add Course
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="scan" className="mt-0 space-y-6">
              {/* File Upload Area */}
              {scanStatus === 'idle' && (
                <FileUpload.DropZone
                  onDropFiles={handleFileSelect}
                  accept="image/*"
                  hint="Upload a clear image of your schedule (PNG, JPG)"
                  className="bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 transition-colors"
                />
              )}

              {/* Error Display */}
              {scanError && (
                <Alert variant="error" className="bg-red-950/20 border-red-900/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{scanError}</AlertDescription>
                </Alert>
              )}

              {/* Processing States */}
              {(scanStatus === 'uploading' || scanStatus === 'ocr' || scanStatus === 'ai') && file && (
                <div className="space-y-4">
                  <FileUpload.ListItemProgressBar
                    name={file.name}
                    size={file.size}
                    progress={scanProgress}
                    type={file.type}
                    className="bg-zinc-900 border-zinc-800"
                  />
                  <p className="text-sm text-center text-zinc-500 animate-pulse">
                    {scanStatus === 'ocr' && 'Extracting text...'}
                    {scanStatus === 'ai' && 'AI analyzing courses...'}
                    {scanStatus === 'uploading' && 'Processing...'}
                  </p>
                </div>
              )}

              {/* Confirmation State */}
              {scanStatus === 'confirm' && extractedCourses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-300">Found {extractedCourses.length} Courses</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-400 hover:text-white">
                      Start Over
                    </Button>
                  </div>

                  {questions.length > 0 && (
                    <Alert variant="warning" className="bg-amber-950/20 border-amber-900/50 text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {questions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="max-h-[300px] overflow-y-auto rounded-lg border border-zinc-800">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-900 text-zinc-400 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 font-medium">Course</th>
                          <th className="px-4 py-2 font-medium">Grade</th>
                          <th className="px-4 py-2 font-medium">Sem</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {extractedCourses.map((course, index) => (
                          <tr key={index} className="hover:bg-zinc-900/50">
                            <td className="px-4 py-2">
                              <div className="font-medium text-white">{course.name}</div>
                              <div className="text-xs text-zinc-500">{course.level} • {course.credits} cr</div>
                            </td>
                            <td className="px-4 py-2 text-zinc-300">{course.grade || '-'}</td>
                            <td className="px-4 py-2 text-zinc-300">{course.semester}</td>
                            <td className="px-4 py-2 text-right">
                              <button onClick={() => removeCourse(index)} className="text-zinc-500 hover:text-red-400 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSaveCourses} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Check className="mr-2 h-4 w-4" />
                      Save All Courses
                    </Button>
                  </div>
                </div>
              )}

              {/* Saving State */}
              {scanStatus === 'saving' && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
