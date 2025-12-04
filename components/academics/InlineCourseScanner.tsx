"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Progress } from "@heroui/react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Scan, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AIManager } from "@/managers/AIManager";
import { ExtractedCourse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InlineCourseScannerProps {
    userId: string;
    onCoursesDetected: (courses: any[]) => void;
    isExpanded: boolean;
    onClose: () => void;
}

export function InlineCourseScanner({
    userId,
    onCoursesDetected,
    isExpanded,
    onClose
}: InlineCourseScannerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setExtractedCourses([]);
            setProgress(0);
        }
    };

    const handleScan = async () => {
        if (!file) return;

        setIsScanning(true);
        setProgress(10);

        try {
            // Simulate OCR progress
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            // In a real implementation, we would upload the file and perform OCR
            // For now, we'll simulate the process with a timeout and mock data
            // or use the actual AIManager if we had a backend endpoint for file upload

            // Mocking text extraction for now since we don't have the file upload endpoint ready
            // In production: const text = await performOCR(file);
            const mockText = "AP Computer Science A - Grade: 95\nHonors English 10 - Grade: 88\nPre-Calculus - Grade: 92";

            clearInterval(interval);
            setProgress(95);

            const result = await AIManager.extractCoursesFromText(userId, mockText);
            setExtractedCourses(result.courses);
            setProgress(100);
            toast.success(`Found ${result.courses.length} courses!`);

        } catch (error) {
            console.error("Scanning failed:", error);
            toast.error("Failed to scan schedule");
            setProgress(0);
        } finally {
            setIsScanning(false);
        }
    };

    const handleConfirm = () => {
        onCoursesDetected(extractedCourses);
        setFile(null);
        setExtractedCourses([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-b border-zinc-800 bg-zinc-900/30 mb-6 rounded-xl"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Scan className="w-5 h-5 text-indigo-400" />
                                    Upload Schedule
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    Upload a screenshot or PDF of your schedule to automatically add courses.
                                </p>
                            </div>
                            <Button isIconOnly variant="light" onPress={onClose}>
                                <X className="w-5 h-5 text-zinc-500" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Upload Area */}
                            <div className="space-y-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
                                        file
                                            ? "border-indigo-500/50 bg-indigo-500/5"
                                            : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                                    )}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />

                                    {file ? (
                                        <>
                                            <FileText className="w-10 h-10 text-indigo-400 mb-3" />
                                            <p className="font-medium text-white">{file.name}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 text-zinc-500 mb-3" />
                                            <p className="font-medium text-zinc-300">Click to upload or drag and drop</p>
                                            <p className="text-xs text-zinc-500 mt-1">Images or PDF up to 5MB</p>
                                        </>
                                    )}
                                </div>

                                {file && !extractedCourses.length && (
                                    <Button
                                        fullWidth
                                        color="primary"
                                        isLoading={isScanning}
                                        onPress={handleScan}
                                        className="bg-indigo-600"
                                    >
                                        {isScanning ? "Scanning..." : "Scan Schedule"}
                                    </Button>
                                )}

                                {isScanning && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-zinc-400">
                                            <span>Analyzing document...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <Progress value={progress} color="primary" size="sm" className="h-1" />
                                    </div>
                                )}
                            </div>

                            {/* Results Area */}
                            <div className="space-y-4">
                                {extractedCourses.length > 0 ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-medium text-zinc-300">Detected Courses</h4>
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {extractedCourses.length} found
                                            </span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 pr-2 custom-scrollbar">
                                            {extractedCourses.map((course, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{course.name}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800">{course.level}</span>
                                                            <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800">{course.grade ? `${course.grade}%` : 'No grade'}</span>
                                                        </div>
                                                    </div>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-zinc-800">
                                            <Button
                                                fullWidth
                                                color="primary"
                                                onPress={handleConfirm}
                                                endContent={<ArrowRight className="w-4 h-4" />}
                                                className="bg-indigo-600 text-white font-medium"
                                            >
                                                Add All Courses
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                                            <Scan className="w-6 h-6 text-zinc-600" />
                                        </div>
                                        <p className="text-sm text-zinc-500">
                                            Scan results will appear here.
                                            <br />
                                            Review them before adding to your timeline.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
